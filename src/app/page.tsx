"use client";

import { ArrowRight, ClipboardList, FileCheck2, Landmark, Lock, ShieldCheck, UserRound, BadgeCheck, Ban } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { CategoryIcon } from "@/components/icons";
import { CATEGORY_INFO } from "@/lib/core/labels";
import { CATEGORIES } from "@/lib/core/types";
import { DEMOS } from "@/lib/demo";
import { SCHEMES } from "@/lib/schemes";
import { loadProfile } from "@/lib/storage";

export default function Home() {
  const { t, tx } = useApp();
  const [state, setState] = useState<"new" | "partial" | "done">("new");

  useEffect(() => {
    const p = loadProfile();
    if (p?.done) setState("done");
    else if (p && Object.keys(p.answers).length > 0) setState("partial");
  }, []);

  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, SCHEMES.filter((s) => s.categories.includes(c)).length]));

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-brand">{t("heroEyebrow")}</span>
            <h1>{t("heroTitle")}</h1>
            <p className="lead">{t("heroSub")}</p>
            <div className="hero-actions">
              <Link href="/profile" className="btn btn-primary btn-lg">
                {state === "partial" ? t("continue") : t("start")} <ArrowRight size={18} aria-hidden />
              </Link>
              {state === "done" ? (
                <Link href="/results" className="btn btn-ghost btn-lg">
                  {t("seeResults")}
                </Link>
              ) : (
                <Link href="/schemes" className="btn btn-ghost btn-lg">
                  {t("browseAll")}
                </Link>
              )}
            </div>
            <p className="hero-note">
              <Lock size={14} aria-hidden /> {t("privacyLine")}
            </p>
          </div>

          <div className="stats card">
            <div>
              <strong>{SCHEMES.length}</strong>
              <span>{t("statSchemes")}</span>
            </div>
            <div>
              <strong>{CATEGORIES.length}</strong>
              <span>{t("statCategories")}</span>
            </div>
            <div>
              <strong>2</strong>
              <span>{t("statTime")}</span>
            </div>
            <div>
              <strong>₹0</strong>
              <span>{t("statCost")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t("howItWorks")}</h2>
        <div className="grid-3">
          {[
            { icon: ClipboardList, title: t("step1Title"), body: t("step1") },
            { icon: FileCheck2, title: t("step2Title"), body: t("step2") },
            { icon: Landmark, title: t("step3Title"), body: t("step3") },
          ].map((s, i) => (
            <div key={i} className="card feature">
              <span className="feature-icon">
                <s.icon size={20} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="feature-step">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p className="muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <h2 className="section-title">{t("examplesTitle")}</h2>
            <p className="muted">{t("examplesSub")}</p>
          </div>
        </div>
        <div className="grid-4">
          {Object.entries(DEMOS).map(([key, d]) => (
            <Link key={key} href={`/results?demo=${key}`} className="card demo-card">
              <span className="demo-avatar">
                <UserRound size={18} aria-hidden />
              </span>
              <strong>{tx(d.label)}</strong>
              <span className="muted">{tx(d.summary)}</span>
              <span className="link-arrow">
                {t("viewResults")} <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t("categoriesTitle")}</h2>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/schemes?c=${c}`} className="cat-tile">
              <span className="cat-icon">
                <CategoryIcon category={c} />
              </span>
              <span className="cat-name">{tx(CATEGORY_INFO[c].label)}</span>
              <span className="cat-count">{counts[c]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="card trust">
          <div>
            <h2 className="section-title">{t("trustTitle")}</h2>
            <p className="muted">{t("helperNote")}</p>
          </div>
          <ul className="trust-list">
            {[
              { icon: Lock, text: t("trust1") },
              { icon: Ban, text: t("trust2") },
              { icon: BadgeCheck, text: t("trust3") },
              { icon: ShieldCheck, text: t("trust4") },
            ].map((x, i) => (
              <li key={i}>
                <x.icon size={18} strokeWidth={1.8} aria-hidden />
                <span>{x.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
