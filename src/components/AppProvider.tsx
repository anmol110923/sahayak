"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang, Text } from "@/lib/core/types";
import { translate, type StringKey } from "@/lib/i18n/strings";
import { loadLang, saveLang } from "@/lib/storage";
import { stopSpeaking } from "@/lib/speech";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: StringKey) => string;
  tx: (x: Text) => string;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const l = loadLang();
    if (l === "hi" || l === "en") setLangState(l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    stopSpeaking();
    setLangState(l);
    saveLang(l);
  }, []);

  const t = useCallback((k: StringKey) => translate(k, lang), [lang]);
  const tx = useCallback((x: Text) => x[lang], [lang]);

  return <AppContext.Provider value={{ lang, setLang, t, tx }}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
