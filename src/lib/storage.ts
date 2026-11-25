// All user data lives only in this browser (localStorage). Nothing is sent to a server
// except the optional, non-identifying AI requests.
import { emptyProfile, type Profile } from "./core/types";

const KEYS = { profile: "sahayak.profile.v1", lang: "sahayak.lang" };

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode / storage blocked — app still works for this session */
  }
}

export function loadProfile(): Profile | null {
  const raw = read(KEYS.profile);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as Profile;
    return { ...emptyProfile(), ...p, answers: p.answers ?? {}, needs: p.needs ?? [] };
  } catch {
    return null;
  }
}
export const saveProfile = (p: Profile) => write(KEYS.profile, JSON.stringify(p));
export const loadLang = () => read(KEYS.lang);
export const saveLang = (v: string) => write(KEYS.lang, v);
export const deleteAllData = () => write(KEYS.profile, null);
