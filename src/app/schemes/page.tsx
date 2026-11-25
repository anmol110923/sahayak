"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { CategoryIcon } from "@/components/icons";
import { CATEGORY_INFO } from "@/lib/core/labels";
import { CATEGORIES, type Category } from "@/lib/core/types";
import { SCHEMES } from "@/lib/schemes";

export default function SchemesPage() {
  const { t, tx } = useApp();
  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (c && (CATEGORIES as readonly string[]).includes(c)) setCat(c as Category);
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SCHEMES.filter((s) => cat === "all" || s.categories.includes(cat)).filter(
      (s) => !needle || [s.name.en, s.name.hi, s.benefit.en, s.benefit.hi, s.ministry].some((x) => x.toLowerCase().includes(needle)),
    );
  }, [cat, q]);

  return (
    <div className="container page">
      <div className="page-head">
        <h1>{t("allSchemes")}</h1>
        <p className="muted">{t("allSchemesSub")}</p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} aria-hidden />
          <input className="input" placeholder={t("search")} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("search")} />
        </div>
        <div className="filter-row">
          <button className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>
            {t("all")} <span className="chip-count">{SCHEMES.length}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              <CategoryIcon category={c} size={15} /> {tx(CATEGORY_INFO[c].label)}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 && <div className="card empty">{t("noMatches")}</div>}
      <div className="scheme-grid">
        {list.map((s) => (
          <Link key={s.id} href={`/scheme/${s.id}`} className="card scheme-tile">
            <div className="scheme-tile-head">
              <span className="scheme-icon">
                <CategoryIcon category={s.categories[0]} />
              </span>
              <span className="badge badge-neutral">{s.level === "central" ? t("central") : t("stateScheme")}</span>
            </div>
            <strong>{tx(s.name)}</strong>
            <p className="muted clamp-3">{tx(s.benefit)}</p>
            <span className="link-arrow">
              {t("details")} <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
