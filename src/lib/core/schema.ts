import { z } from "zod";
import { CATEGORIES, CHANNELS, FIELD_KEYS, OPS, type Rule } from "./types";

const TextSchema = z.object({ hi: z.string().min(1), en: z.string().min(1) });

const ConditionSchema = z.object({
  field: z.enum(FIELD_KEYS),
  op: z.enum(OPS),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))]),
});

export const RuleSchema: z.ZodType<Rule> = z.lazy(() =>
  z.union([ConditionSchema, z.object({ all: z.array(RuleSchema).min(1) }), z.object({ any: z.array(RuleSchema).min(1) })]),
);

export const SchemeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  level: z.enum(["central", "state"]),
  states: z.array(z.string().length(2)),
  name: TextSchema,
  ministry: z.string().min(1),
  categories: z.array(z.enum(CATEGORIES)).min(1),
  benefit: TextSchema,
  description: TextSchema,
  benefitValue: z.number().nonnegative(),
  eligibility: RuleSchema,
  conditions: z.array(TextSchema),
  documents: z.array(z.string()),
  channels: z.array(z.enum(CHANNELS)).min(1),
  applyUrl: z.string().url(),
  sourceUrl: z.string().url(),
  helpline: z.string().optional(),
  lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
