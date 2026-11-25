"use client";

import { Languages, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import { BrandMark } from "./icons";
import { LANG_NAMES, LANGS, type Lang } from "@/lib/core/types";

/** Text size control (A- A A+), a staple of public-service sites for readers with low vision. */
const SIZES = [0.9, 1, 1.15] as const;
const SIZE_KEY = "yojanasetu.textsize";

function TextSize() {
  const { t } = useApp();
  const [size, setSize] = useState<number>(1);
  useEffect(() => {
    const saved = Number(localStorage.getItem(SIZE_KEY));
    if (SIZES.includes(saved as (typeof SIZES)[number])) setSize(saved);
  }, []);
  useEffect(() => {
    document.documentElement.style.fontSize = `${size * 100}%`;
    try {
      localStorage.setItem(SIZE_KEY, String(size));
    } catch {
      /* storage blocked */
    }
  }, [size]);
  return (
    <div className="text-size" role="group" aria-label={t("textSize")}>
      {SIZES.map((s, i) => (
        <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} title={t("textSize")}>
          {["A-", "A", "A+"][i]}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { lang, setLang, t } = useApp();
  const path = usePathname();
  const nav = [
    { href: "/", label: t("home"), active: path === "/" },
    { href: "/profile", label: t("start"), active: path?.startsWith("/profile") },
    { href: "/results", label: t("seeResults"), active: path?.startsWith("/results") || path?.startsWith("/compare") || path?.startsWith("/print") },
    { href: "/schemes", label: t("allSchemes"), active: path?.startsWith("/schemes") || path?.startsWith("/scheme/") },
    { href: "/privacy", label: t("privacy"), active: path?.startsWith("/privacy") },
  ];

  return (
    <header>
      <a href="#main" className="skip-link">
        {t("skipToMain")}
      </a>
      <div className="utility">
        <div className="container utility-inner">
          <p className="utility-note">
            <Info size={14} aria-hidden /> <span>{t("notGovt")}</span>
          </p>
          <div className="utility-tools">
            <TextSize />
            <label className="lang-select">
              <Languages size={15} aria-hidden />
              <span className="sr-only">{t("language")}</span>
              <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t("language")}>
                {LANGS.map((l) => (
                  <option key={l} value={l}>
                    {LANG_NAMES[l]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="tricolour" aria-hidden />
      <div className="masthead">
        <div className="container masthead-inner">
          <Link href="/" className="brand" aria-label={t("home")}>
            <span className="brand-mark" aria-hidden>
              <BrandMark size={52} />
            </span>
            <span className="brand-text">
              <span className="brand-hi">योजना सेतु</span>
              <span className="brand-en">Yojana Setu</span>
              <small>
                {t("appTag")} · <span className="brand-by">{t("bySahayak")}</span>
              </small>
            </span>
          </Link>
          <div className="masthead-cta">
            <Link href="/profile" className="btn btn-primary">
              {t("start")}
            </Link>
          </div>
        </div>
      </div>
      <nav className="navbar" aria-label="Main">
        <div className="container navbar-inner">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`nav-link ${n.active ? "active" : ""}`} aria-current={n.active ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="footer">
      <div className="tricolour" aria-hidden />
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2>{t("appName")}</h2>
            <p>{t("footer")}</p>
          </div>
          <div>
            <h2>{t("quickLinks")}</h2>
            <ul className="footer-links">
              <li>
                <Link href="/profile">{t("start")}</Link>
              </li>
              <li>
                <Link href="/schemes">{t("allSchemes")}</Link>
              </li>
              <li>
                <Link href="/privacy">{t("privacy")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{t("trustTitle")}</h2>
            <ul className="footer-links">
              <li>{t("trust2")}</li>
              <li>{t("trust4")}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Sahayak · {t("notGovt")}
          </span>
          <span>{t("verifyNote")}</span>
        </div>
      </div>
    </footer>
  );
}
