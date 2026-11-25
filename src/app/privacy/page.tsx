"use client";

import { Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { deleteAllData } from "@/lib/storage";

const POINTS = {
  hi: [
    "आपकी जानकारी सिर्फ़ आपके डिवाइस के ब्राउज़र में सेव होती है। हमारे पास उपयोगकर्ताओं का कोई डेटाबेस नहीं है।",
    "हम कभी नाम, फ़ोन नंबर, आधार नंबर, बैंक खाता नंबर या OTP नहीं माँगते।",
    "योजनाओं का मिलान आपके डिवाइस पर ही होता है और इंटरनेट न होने पर भी काम करता है।",
    "AI सारांश के लिए सिर्फ़ पात्रता से जुड़ी जानकारी (जैसे उम्र, राज्य, काम) बिना किसी पहचान के भेजी जाती है।",
    "सभी आवेदन लिंक सिर्फ़ आधिकारिक सरकारी वेबसाइटों पर जाते हैं।",
    "आप नीचे दिए बटन से कभी भी अपनी सारी जानकारी मिटा सकते हैं।",
  ],
  en: [
    "Your details are stored only in this device's browser. We keep no database of users.",
    "We never ask for your name, phone number, Aadhaar number, bank account number or OTP.",
    "Scheme matching runs on your device and keeps working without an internet connection.",
    "For AI summaries, only eligibility details (such as age, state and occupation) are sent, with nothing that identifies you.",
    "All apply links go only to official government websites.",
    "You can delete all of your data at any time using the button below.",
  ],
};

export default function PrivacyPage() {
  const { lang, t } = useApp();
  const router = useRouter();
  return (
    <div className="container container-narrow page">
      <div className="page-head">
        <h1>{t("privacy")}</h1>
        <p className="muted">{t("trust4")}</p>
      </div>
      <div className="card">
        <ul className="list-check list-roomy">
          {POINTS[lang].map((p) => (
            <li key={p}>
              <Check size={16} className="ic-success" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="divider" />
        <button
          className="btn btn-danger-ghost"
          onClick={() => {
            deleteAllData();
            alert(t("deleted"));
            router.push("/");
          }}
        >
          <Trash2 size={16} aria-hidden /> {t("deleteData")}
        </button>
      </div>
    </div>
  );
}
