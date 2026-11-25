import { describeCondition, describeRule } from "./core/describe";
import type { Match } from "./core/match";
import type { Lang } from "./core/types";

const LOW_SIGNAL = new Set(["taxPayer"]);

/** Plain-language reasons built only from rules that actually passed / could not be checked. */
export function reasonsFor(m: Match, lang: Lang): { why: string[]; confirm: string[] } {
  const passed = [...m.result.passed].sort((a, b) => Number(LOW_SIGNAL.has(a.field)) - Number(LOW_SIGNAL.has(b.field)));
  const why = [...new Set(passed.map((c) => describeCondition(c, lang)))];
  const confirm = [...new Set(m.result.unknown.map((r) => describeRule(r, lang)))];
  return { why, confirm };
}
