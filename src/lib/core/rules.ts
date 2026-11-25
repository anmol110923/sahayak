// Deterministic eligibility engine. Each condition evaluates to pass / fail / unknown.
// "unknown" happens when the user skipped or answered "I don't know" — it never hides a scheme.
import { FIELD_MAP } from "./fields";
import type { Answer, Condition, Profile, Rule, Tri } from "./types";

export const isCondition = (r: Rule): r is Condition => "field" in r;

export type EvalResult = {
  status: Tri;
  passed: Condition[];
  failed: Condition[];
  /** Conditions (or whole "any" groups) we could not check. */
  unknown: Rule[];
};

/** Turn an answer into a numeric range [lo, hi] for range/number fields. */
function toRange(cond: Condition, value: Answer): [number, number] | null {
  const def = FIELD_MAP[cond.field];
  if (typeof value === "number") return [value, value];
  if (def.kind === "range") {
    const opt = def.options.find((o) => o.id === value);
    return opt?.range ?? null;
  }
  return null;
}

export function evalCondition(cond: Condition, profile: Profile): Tri {
  const value = profile.answers[cond.field];
  if (value === undefined || value === null) return "unknown";
  const v = cond.value;

  switch (cond.op) {
    case "eq":
      return value === v ? "pass" : "fail";
    case "in":
      return Array.isArray(v) && v.includes(value as string) ? "pass" : "fail";
    case "notIn":
      return Array.isArray(v) && v.includes(value as string) ? "fail" : "pass";
    case "gte":
    case "lte":
    case "between": {
      const r = toRange(cond, value);
      if (!r) return "unknown";
      const [lo, hi] = r;
      if (cond.op === "gte") {
        const x = Number(v);
        return lo >= x ? "pass" : hi < x ? "fail" : "unknown";
      }
      if (cond.op === "lte") {
        const x = Number(v);
        return hi <= x ? "pass" : lo > x ? "fail" : "unknown";
      }
      const [a, b] = (v as number[]).map(Number);
      return lo >= a && hi <= b ? "pass" : hi < a || lo > b ? "fail" : "unknown";
    }
  }
}

export function evaluate(rule: Rule, profile: Profile): EvalResult {
  if (isCondition(rule)) {
    const status = evalCondition(rule, profile);
    return {
      status,
      passed: status === "pass" ? [rule] : [],
      failed: status === "fail" ? [rule] : [],
      unknown: status === "unknown" ? [rule] : [],
    };
  }

  if ("all" in rule) {
    const parts = rule.all.map((r) => evaluate(r, profile));
    const status: Tri = parts.some((p) => p.status === "fail")
      ? "fail"
      : parts.some((p) => p.status === "unknown")
        ? "unknown"
        : "pass";
    return {
      status,
      passed: parts.flatMap((p) => p.passed),
      failed: parts.flatMap((p) => p.failed),
      unknown: parts.flatMap((p) => p.unknown),
    };
  }

  // any
  const parts = rule.any.map((r) => evaluate(r, profile));
  const winner = parts.find((p) => p.status === "pass");
  if (winner) return { status: "pass", passed: winner.passed, failed: [], unknown: [] };
  if (parts.some((p) => p.status === "unknown")) return { status: "unknown", passed: [], failed: [], unknown: [rule] };
  return { status: "fail", passed: [], failed: parts.flatMap((p) => p.failed), unknown: [] };
}
