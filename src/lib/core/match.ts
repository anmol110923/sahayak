// Ranking: deterministic filter first, then score. The LLM (optional) only re-orders
// and re-words the shortlist produced here — it never adds schemes.
import { evaluate, type EvalResult } from "./rules";
import type { Category, Profile, Scheme } from "./types";

export type Match = {
  scheme: Scheme;
  /** "likely": every checkable rule passed. "maybe": some rules could not be checked. */
  status: "likely" | "maybe";
  result: EvalResult;
  score: number;
  needMatch: boolean;
};

const STALE_DAYS = 365;

export function isStale(s: Scheme, now = new Date()): boolean {
  const reviewed = new Date(s.lastReviewed).getTime();
  return (now.getTime() - reviewed) / 86_400_000 > STALE_DAYS;
}

export function scoreMatch(s: Scheme, r: EvalResult, needs: Category[]): { score: number; needMatch: boolean } {
  const needMatch = needs.length > 0 && s.categories.some((c) => needs.includes(c));
  let score = r.status === "pass" ? 1 : 0.55;
  // Targeted schemes rank above generic ones. Broad checks ("not a govt employee", "no income tax", "adult") don't count.
  const specific = r.passed.filter(
    (c) => c.op !== "notIn" && c.field !== "taxPayer" && !(c.field === "age" && c.op === "gte" && Number(c.value) <= 18),
  );
  score += 0.09 * Math.min(specific.length, 5);
  score -= 0.08 * Math.min(r.unknown.length, 5);
  score += 0.3 * (Math.log10(Math.max(s.benefitValue, 100)) / 6); // bigger benefit, small boost
  if (needMatch) score += 0.6;
  if (s.level === "state") score += 0.1; // state schemes are specific to the user's location
  return { score: Math.round(score * 1000) / 1000, needMatch };
}

export function matchSchemes(profile: Profile, schemes: Scheme[]): Match[] {
  const out: Match[] = [];
  for (const scheme of schemes) {
    const result = evaluate(scheme.eligibility, profile);
    if (result.status === "fail") continue;
    const { score, needMatch } = scoreMatch(scheme, result, profile.needs);
    out.push({ scheme, status: result.status === "pass" ? "likely" : "maybe", result, score, needMatch });
  }
  return out.sort((a, b) => b.score - a.score);
}
