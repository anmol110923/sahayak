"use client";

import { ArrowUpRight, Check, CircleHelp, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useApp } from "./AppProvider";
import { CategoryIcon } from "./icons";
import { SpeakButton } from "./Voice";
import type { Match } from "@/lib/core/match";
import type { Scheme } from "@/lib/core/types";
import { reasonsFor } from "@/lib/explain";
import { isOfficialUrl } from "@/lib/schemes";

export function whatsappLink(s: Scheme, lang: "hi" | "en"): string {
  const text =
    `${s.name[lang]}\n${s.benefit[lang]}\n\n` +
    (lang === "hi" ? "आधिकारिक वेबसाइट: " : "Official website: ") +
    `${s.applyUrl}\n` +
    (lang === "hi" ? "विवरण: " : "Details: ") +
    `${window.location.origin}/scheme/${s.id}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function ShareButton({ scheme }: { scheme: Scheme }) {
  const { lang, t } = useApp();
  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.open(whatsappLink(scheme, lang), "_blank", "noopener,noreferrer")}>
      <Share2 size={16} aria-hidden /> {t("share")}
    </button>
  );
}

export function ApplyButton({ scheme, block = false }: { scheme: Scheme; block?: boolean }) {
  const { t } = useApp();
  if (!isOfficialUrl(scheme.applyUrl)) return null; // never show a non-government link
  return (
    <a className={`btn btn-primary ${block ? "btn-block btn-lg" : "btn-sm"}`} href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
      {t("apply")} <ArrowUpRight size={16} aria-hidden />
    </a>
  );
}

export function StatusBadge({ status }: { status: Match["status"] }) {
  const { t } = useApp();
  return <span className={`badge ${status === "likely" ? "badge-success" : "badge-warn"}`}>{status === "likely" ? t("likely") : t("maybe")}</span>;
}

export function SchemeCard({ match, rank, aiWhy }: { match: Match; rank: number; aiWhy?: string }) {
  const { lang, t, tx } = useApp();
  const s = match.scheme;
  const { why, confirm } = reasonsFor(match, lang);
  const speech = `${tx(s.name)}. ${tx(s.benefit)}. ${aiWhy ?? why.slice(0, 2).join(". ")}`;

  return (
    <article className="card scheme-card">
      <header className="scheme-head">
        <span className="scheme-rank">{rank}</span>
        <span className="scheme-icon">
          <CategoryIcon category={s.categories[0]} />
        </span>
        <div className="scheme-title">
          <h3>
            <Link href={`/scheme/${s.id}`}>{tx(s.name)}</Link>
          </h3>
          <p className="scheme-ministry">{s.ministry}</p>
        </div>
        <div className="scheme-badges">
          <StatusBadge status={match.status} />
          <span className="badge badge-neutral">{s.level === "central" ? t("central") : t("stateScheme")}</span>
        </div>
      </header>

      <p className="benefit">{tx(s.benefit)}</p>

      {aiWhy && (
        <div className="ai-box">
          <span className="eyebrow">
            <Sparkles size={14} aria-hidden /> {t("aiBadge")}
          </span>
          <p>{aiWhy}</p>
        </div>
      )}

      <div className="reason-grid">
        {why.length > 0 && (
          <div>
            <span className="eyebrow">{t("whyFits")}</span>
            <ul className="list-check">
              {why.slice(0, 4).map((w) => (
                <li key={w}>
                  <Check size={16} aria-hidden className="ic-success" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {confirm.length > 0 && (
          <div>
            <span className="eyebrow">{t("pleaseConfirm")}</span>
            <ul className="list-check">
              {confirm.slice(0, 3).map((w) => (
                <li key={w}>
                  <CircleHelp size={16} aria-hidden className="ic-warn" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="card-actions">
        <ApplyButton scheme={s} />
        <Link className="btn btn-ghost btn-sm" href={`/scheme/${s.id}`}>
          {t("details")}
        </Link>
        <ShareButton scheme={s} />
        <span className="spacer" />
        <SpeakButton text={speech} label={false} />
      </footer>
    </article>
  );
}
