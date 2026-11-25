// Offline keyword detection of needs from free text / voice (Hindi, Hinglish, English).
// The optional LLM endpoint improves on this, but this always works.
import type { Category } from "./types";

const KEYWORDS: Record<Category, string[]> = {
  farming: ["खेत", "खेती", "किसान", "फसल", "बीज", "खाद", "ट्रैक्टर", "सिंचाई", "kisan", "kheti", "farm", "crop", "seed", "fertili", "tractor", "irrigat"],
  health: ["इलाज", "अस्पताल", "बीमार", "दवा", "ऑपरेशन", "डॉक्टर", "ilaj", "hospital", "treatment", "sick", "medicine", "operation", "doctor", "health"],
  pension: ["पेंशन", "बुढ़ापा", "बुजुर्ग", "बुज़ुर्ग", "pension", "old age", "budhapa", "retire"],
  insurance: ["बीमा", "दुर्घटना", "bima", "insurance", "accident"],
  housing: ["घर", "मकान", "छत", "आवास", "ghar", "makan", "house", "home", "roof", "awas"],
  education: ["पढ़ाई", "पढाई", "स्कूल", "कॉलेज", "फीस", "छात्रवृत्ति", "वज़ीफ़ा", "padhai", "school", "college", "fees", "scholarship", "study", "education"],
  jobs: ["नौकरी", "रोज़गार", "रोजगार", "काम चाहिए", "मज़दूरी", "हुनर", "ट्रेनिंग", "naukri", "rozgar", "job", "work", "employment", "skill", "training"],
  business: ["लोन", "कर्ज", "क़र्ज़", "धंधा", "व्यापार", "दुकान", "loan", "karz", "business", "shop", "dukan", "credit"],
  women_child: ["बेटी", "गर्भ", "बच्चा", "बच्चे", "शादी", "महिला", "beti", "daughter", "pregnan", "baby", "child", "girl", "women", "wedding", "marriage"],
  food: ["राशन", "खाना", "अनाज", "भूख", "ration", "food", "grain", "anaj"],
  disability: ["दिव्यांग", "विकलांग", "व्हीलचेयर", "disab", "handicap", "wheelchair", "viklang"],
  utilities: ["गैस", "सिलेंडर", "बिजली", "शौचालय", "सोलर", "gas", "lpg", "cylinder", "electric", "bijli", "toilet", "solar"],
  banking: ["खाता", "बचत", "बैंक", "khata", "account", "saving", "bank"],
};

export function detectNeeds(text: string): Category[] {
  const t = text.toLowerCase();
  if (!t.trim()) return [];
  return (Object.keys(KEYWORDS) as Category[]).filter((c) => KEYWORDS[c].some((k) => t.includes(k)));
}
