// Free-tier LLM providers, called with plain fetch (no SDKs).
// Everything here is optional: if no key is configured, callers fall back to rule-based output.

type Provider = "gemini" | "groq";

function pickProvider(): Provider | null {
  const forced = process.env.LLM_PROVIDER as Provider | undefined;
  if (forced === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (forced === "groq" && process.env.GROQ_API_KEY) return "groq";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GROQ_API_KEY) return "groq";
  return null;
}

export const llmEnabled = () => pickProvider() !== null;

/** Returns the model's JSON text, or null on any failure / timeout. */
export async function completeJSON(system: string, user: string, timeoutMs = 12000): Promise<string | null> {
  const provider = pickProvider();
  if (!provider) return null;
  try {
    if (provider === "gemini") {
      // Try the configured model first, then fast "latest" aliases (these survive model retirements).
      const models = [...new Set([process.env.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-flash-latest"].filter(Boolean))] as string[];
      const deadline = Date.now() + timeoutMs;
      for (const model of models) {
        const remaining = deadline - Date.now();
        if (remaining < 1500) break;
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: system }] },
              contents: [{ role: "user", parts: [{ text: user }] }],
              generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
            }),
            signal: AbortSignal.timeout(remaining),
          });
          if (!res.ok) continue; // retired (404) or overloaded (503) → next model
          const j = await res.json();
          const parts: { text?: string; thought?: boolean }[] = j?.candidates?.[0]?.content?.parts ?? [];
          const text = parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
          if (text) return text;
        } catch {
          /* timeout / network → next model */
        }
      }
      return null;
    }

    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const j = await res.json();
    return j?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export function parseJSON(text: string | null): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
  } catch {
    return null;
  }
}
