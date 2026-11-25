import data from "../../data/schemes.json";
import type { Scheme } from "./core/types";

// Validated at build/dev time by scripts/validate-data.ts (npm run validate:data).
export const SCHEMES = data as unknown as Scheme[];

export const SCHEME_BY_ID: Record<string, Scheme> = Object.fromEntries(SCHEMES.map((s) => [s.id, s]));

/** Only these domains may be shown as "apply" / "source" links. */
const OFFICIAL_SUFFIXES = [".gov.in", ".nic.in"];
const OFFICIAL_EXTRA = ["maandhan.in", "jansamarth.in", "mudra.org.in", "standupmitra.in", "pfrda.org.in"];

export function isOfficialUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.replace(/^www\./, "");
    return OFFICIAL_SUFFIXES.some((s) => host.endsWith(s)) || OFFICIAL_EXTRA.includes(host);
  } catch {
    return false;
  }
}
