// Checks data/schemes.json: schema, unique ids, official links, known documents,
// valid option values in rules. Run: npm run validate:data
import { SchemeSchema } from "../src/lib/core/schema";
import { FIELD_MAP } from "../src/lib/core/fields";
import { DOCUMENTS } from "../src/lib/core/labels";
import { isCondition } from "../src/lib/core/rules";
import type { Rule } from "../src/lib/core/types";
import { SCHEMES, isOfficialUrl } from "../src/lib/schemes";

const errors: string[] = [];
const ids = new Set<string>();
const usedFields = new Set<string>();

function checkRule(id: string, r: Rule) {
  if (!isCondition(r)) return ("all" in r ? r.all : r.any).forEach((x) => checkRule(id, x));
  usedFields.add(r.field);
  const def = FIELD_MAP[r.field];
  if ((r.op === "eq" || r.op === "in" || r.op === "notIn") && (def.kind === "enum" || def.kind === "range")) {
    const vals = Array.isArray(r.value) ? r.value : [r.value];
    for (const v of vals) if (!def.options.some((o) => o.id === v)) errors.push(`${id}: unknown option "${v}" for ${r.field}`);
  }
  if (def.kind === "bool" && typeof r.value !== "boolean") errors.push(`${id}: ${r.field} needs boolean`);
}

for (const s of SCHEMES) {
  const parsed = SchemeSchema.safeParse(s);
  if (!parsed.success) errors.push(`${s.id}: ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`);
  if (ids.has(s.id)) errors.push(`${s.id}: duplicate id`);
  ids.add(s.id);
  for (const u of [s.applyUrl, s.sourceUrl]) if (!isOfficialUrl(u)) errors.push(`${s.id}: not an official URL: ${u}`);
  for (const d of s.documents) if (!DOCUMENTS[d]) errors.push(`${s.id}: unknown document "${d}"`);
  if (s.level === "state" && s.states.length === 0) errors.push(`${s.id}: state scheme without states`);
  checkRule(s.id, s.eligibility);
}

for (const f of Object.keys(FIELD_MAP)) if (!usedFields.has(f)) errors.push(`profile field "${f}" is not used by any scheme rule`);

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${SCHEMES.length} schemes valid (${SCHEMES.filter((s) => s.level === "state").length} state).`);
