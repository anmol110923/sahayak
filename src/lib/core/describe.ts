// Turns rule conditions into short, plain sentences in Hindi or English.
import { FIELD_MAP } from "./fields";
import { isCondition } from "./rules";
import type { Condition, Lang, Rule } from "./types";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function fmtNumber(field: Condition["field"], n: number, lang: Lang): string {
  const def = FIELD_MAP[field];
  if (def.kind === "number") return `${n} ${lang === "hi" ? "साल" : "years"}`;
  if (def.kind === "range") {
    if (def.unit === "rupees") return inr(n) + (lang === "hi" ? " सालाना" : " a year");
    if (def.unit === "hectares") return `${n} ${lang === "hi" ? "हेक्टेयर" : "hectares"} (${Math.round(n * 2.47 * 10) / 10} ${lang === "hi" ? "एकड़" : "acres"})`;
    if (def.unit === "percent") return `${n}%`;
  }
  return String(n);
}

function optLabel(field: Condition["field"], id: string | number, lang: Lang): string {
  const def = FIELD_MAP[field];
  if (def.kind === "enum" || def.kind === "range") {
    return def.options.find((o) => o.id === id)?.label[lang] ?? String(id);
  }
  return String(id);
}

export function describeCondition(c: Condition, lang: Lang): string {
  const def = FIELD_MAP[c.field];
  const label = def.label[lang];
  const hi = lang === "hi";

  // Special-case "has land" so it reads naturally.
  if (c.field === "land" && c.op === "gte" && Number(c.value) <= 0.01) return hi ? "खेती की ज़मीन आपके नाम पर हो" : "Owns farm land";

  if (def.kind === "bool") return c.value === true ? def.yesText[lang] : def.noText[lang];

  switch (c.op) {
    case "eq":
      return `${label}: ${optLabel(c.field, c.value as string, lang)}`;
    case "in":
      return `${label}: ${(c.value as string[]).map((v) => optLabel(c.field, v, lang)).join(hi ? " या " : " or ")}`;
    case "notIn":
      return `${label}: ${hi ? "यह न हो — " : "not "}${(c.value as string[]).map((v) => optLabel(c.field, v, lang)).join(", ")}`;
    case "gte":
      return `${label}: ${fmtNumber(c.field, Number(c.value), lang)} ${hi ? "या ज़्यादा" : "or more"}`;
    case "lte":
      return `${label}: ${hi ? "" : "up to "}${fmtNumber(c.field, Number(c.value), lang)}${hi ? " तक" : ""}`;
    case "between": {
      const [a, b] = c.value as number[];
      return `${label}: ${fmtNumber(c.field, a, lang).replace(/ (साल|years)$/, "")} – ${fmtNumber(c.field, b, lang)}`;
    }
  }
}

export function describeRule(r: Rule, lang: Lang): string {
  if (isCondition(r)) return describeCondition(r, lang);
  if ("all" in r) return r.all.map((x) => describeRule(x, lang)).join(lang === "hi" ? " और " : " and ");
  return (lang === "hi" ? "इनमें से कोई एक: " : "Any one of: ") + r.any.map((x) => describeRule(x, lang)).join(" / ");
}

/** Flatten the top level of a rule into a readable checklist. */
export function ruleChecklist(r: Rule, lang: Lang): string[] {
  if ("all" in r) return r.all.map((x) => describeRule(x, lang));
  return [describeRule(r, lang)];
}
