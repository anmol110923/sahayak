"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppProvider";

export function Header() {
  const { lang, setLang, t } = useApp();
  const path = usePathname();
  const nav = [
    { href: "/schemes", label: t("allSchemes") },
    { href: "/privacy", label: t("privacy") },
  ];

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link href="/" className="brand" aria-label={t("home")}>
          <span className="brand-mark" aria-hidden>
            स
          </span>
          <span className="brand-text">
            <strong>Sahayak</strong>
            <small>{t("appTag")}</small>
          </span>
        </Link>
        <nav className="topnav">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`topnav-link ${path?.startsWith(n.href) ? "active" : ""}`}>
              {n.label}
            </Link>
          ))}
          <div className="lang-switch" role="group" aria-label="Language">
            <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              EN
            </button>
            <button aria-pressed={lang === "hi"} onClick={() => setLang("hi")}>
              हिं
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>Sahayak</strong>
          <p className="muted">{t("footer")}</p>
        </div>
        <nav className="footer-links">
          <Link href="/">{t("home")}</Link>
          <Link href="/schemes">{t("allSchemes")}</Link>
          <Link href="/privacy">{t("privacy")}</Link>
        </nav>
      </div>
    </footer>
  );
}
