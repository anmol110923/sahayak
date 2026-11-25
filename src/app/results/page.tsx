"use client";

import { ArrowRight, Info, Pencil, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { SchemeCard } from "@/components/SchemeCard";
import { SpeakButton } from "@/components/Voice";
import { CategoryIcon } from "@/components/icons";
import { answerLabel, visibleFields } from "@/lib/core/fields";
import { CATEGORY_INFO } from "@/lib/core/labels";
import { matchSchemes, type Match } from "@/lib/core/match";
import type { Profile } from "@/lib/core/types";
import { DEMOS } from "@/lib/demo";
import { reasonsFor } from "@/lib/explain";
import { SCHEMES } from "@/lib/schemes";
import { deleteAllData, loadProfile, saveProfile } from "@/lib/storage";

const TOP_N = 10;
const AI_POOL = 15;

type AiState = { status: "idle" | "loading" | "done" | "off"; order?: string[]; why?: Record<string, string> };

function profileSummary(p: Profile): string[] {
  return visibleFields(p.answers)
    .filter((f) => p.answers[f.key] !== undefined && p.answers[f.key] !== null)
    .map((f) => `${f.label.en}: ${answerLabel(f, p.answers[f.key]!, "en")}`)
    .concat(p.needs.length ? [`Wants help with: ${p.needs.join(", ")}`] : []);
}

export default function ResultsPage() {
  const router = useRouter();
  const { lang, t, tx } = useApp();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [demo, setDemo] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [ai, setAi] = useState<AiState>({ status: "idle" });

  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("demo");
    if (d && DEMOS[d]) {
      setDemo(d);
      setProfile(DEMOS[d].profile);
    } else setProfile(loadProfile());
  }, []);

  const matches = useMemo(() => (profile ? matchSchemes(profile, SCHEMES) : []), [profile]);

  // Optional AI re-rank + plain-language summaries. Rule-based results are shown immediately.
  useEffect(() => {
    if (!profile || matches.length === 0) return;
    const pool = matches.slice(0, AI_POOL);
    let cancelled = false;
    setAi({ status: "loading" });
    fetch("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lang,
        profile: profileSummary(profile),
        needText: profile.needText?.slice(0, 400) || undefined,
        candidates: pool.map((m) => ({ id: m.scheme.id, status: m.status, reasons: reasonsFor(m, "en").why.slice(0, 6) })),
      }),
      signal: AbortSignal.timeout(20000),
    })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (!j.enabled || !Array.isArray(j.ranked) || j.ranked.length === 0) return setAi({ status: "off" });
        const why: Record<string, string> = {};
        for (const r of j.ranked as { id: string; why: string }[]) why[r.id] = r.why;
        setAi({ status: "done", order: (j.ranked as { id: string }[]).map((r) => r.id), why });
      })
      .catch(() => !cancelled && setAi({ status: "off" }));
    return () => {
      cancelled = true;
    };
  }, [matches, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const ordered: Match[] = useMemo(() => {
    if (ai.status !== "done" || !ai.order) return matches;
    const pool = matches.slice(0, AI_POOL);
    const byId = new Map(pool.map((m) => [m.scheme.id, m]));
    const head = ai.order.map((id) => byId.get(id)).filter((m): m is Match => !!m);
    const rest = pool.filter((m) => !ai.order!.includes(m.scheme.id));
    return [...head, ...rest, ...matches.slice(AI_POOL)];
  }, [matches, ai]);

  if (profile === undefined) return null;

  if (!profile || Object.keys(profile.answers).length === 0) {
    return (
      <div className="container container-narrow page">
        <div className="card empty">
          <p>{t("noProfile")}</p>
          <Link href="/profile" className="btn btn-primary">
            {t("start")} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const shown = showAll ? ordered : ordered.slice(0, TOP_N);
  const likely = matches.filter((m) => m.status === "likely").length;
  const listen = [t("resultsTitle"), ...shown.slice(0, 5).map((m, i) => `${i + 1}. ${tx(m.scheme.name)}. ${tx(m.scheme.benefit)}`)].join(". ");
  const answered = visibleFields(profile.answers).filter((f) => f.key in profile.answers);

  return (
    <div className="container page">
      <div className="page-head page-head-row">
        <div>
          {demo && <span className="eyebrow eyebrow-brand">{t("example")}: {tx(DEMOS[demo].label)}</span>}
          <h1>{t("resultsTitle")}</h1>
          <p className="muted">
            <strong className="text-strong">{matches.length}</strong> {t("found")} · {likely} {t("likely").toLowerCase()} · {t("resultsSub")}
          </p>
        </div>
        <SpeakButton text={listen} />
      </div>

      <div className="results-layout">
        <div className="results-main">
          {ai.status === "loading" && (
            <p className="hint">
              <span className="spinner" /> {t("aiWorking")}
            </p>
          )}
          {matches.length === 0 ? (
            <div className="card empty">{t("noResults")}</div>
          ) : (
            shown.map((m, i) => <SchemeCard key={m.scheme.id} match={m} rank={i + 1} aiWhy={ai.why?.[m.scheme.id]} />)
          )}
          {!showAll && ordered.length > TOP_N && (
            <button className="btn btn-ghost btn-block" onClick={() => setShowAll(true)}>
              {t("showMore")} ({ordered.length - TOP_N})
            </button>
          )}
        </div>

        <aside className="results-side">
          <div className="card side-card">
            <h2 className="side-title">{t("yourDetails")}</h2>
            <dl className="kv-list">
              {answered.map((f) => (
                <div key={f.key}>
                  <dt>{tx(f.label)}</dt>
                  <dd>{answerLabel(f, profile.answers[f.key]!, lang)}</dd>
                </div>
              ))}
            </dl>
            {profile.needs.length > 0 && (
              <>
                <h3 className="side-sub">{t("focusAreas")}</h3>
                <div className="tag-row">
                  {profile.needs.map((c) => (
                    <span key={c} className="tag">
                      <CategoryIcon category={c} size={14} /> {tx(CATEGORY_INFO[c].label)}
                    </span>
                  ))}
                </div>
              </>
            )}
            <div className="side-actions">
              <Link href="/profile?edit=1" className="btn btn-ghost btn-sm">
                <Pencil size={15} aria-hidden /> {t("editAnswers")}
              </Link>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  saveProfile({ answers: {}, needs: [] });
                  router.push("/profile");
                }}
              >
                <UserPlus size={15} aria-hidden /> {t("newProfile")}
              </button>
              <button
                className="btn btn-danger-ghost btn-sm"
                onClick={() => {
                  deleteAllData();
                  alert(t("deleted"));
                  router.push("/");
                }}
              >
                <Trash2 size={15} aria-hidden /> {t("deleteData")}
              </button>
            </div>
          </div>
          <div className="notice">
            <Info size={16} aria-hidden />
            <span>{t("verifyNote")}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
