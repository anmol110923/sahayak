// Optional AI step: map a free-text / spoken need to scheme categories.
import { NextResponse } from "next/server";
import { z } from "zod";
import { CATEGORIES } from "@/lib/core/types";
import { completeJSON, llmEnabled, parseJSON } from "@/lib/llm/provider";

const Body = z.object({ text: z.string().min(1).max(400) });
const Out = z.object({ categories: z.array(z.string()) });

export async function POST(req: Request) {
  if (!llmEnabled()) return NextResponse.json({ enabled: false, categories: [] });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ enabled: true, categories: [] }, { status: 400 });

  const system = `Classify a person's need (Hindi, Hinglish or English) into these government-scheme categories: ${CATEGORIES.join(", ")}. Reply as JSON {"categories":[...]} using only those words. Pick 1-3.`;
  const out = Out.safeParse(parseJSON(await completeJSON(system, parsed.data.text, 8000)));
  const categories = out.success ? out.data.categories.filter((c) => (CATEGORIES as readonly string[]).includes(c)) : [];
  return NextResponse.json({ enabled: true, categories });
}
