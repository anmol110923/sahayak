"use client";

import { Mic, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "./AppProvider";
import { canListen, canSpeak, listenOnce, speak, stopSpeaking } from "@/lib/speech";

export function SpeakButton({ text, label = true }: { text: string; label?: boolean }) {
  const { lang, t } = useApp();
  const [ok, setOk] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setOk(canSpeak()), []);
  useEffect(() => () => stopSpeaking(), []);
  if (!ok) return null;

  return (
    <button
      type="button"
      className={`btn btn-subtle btn-sm ${label ? "" : "btn-icon"}`}
      onClick={() => {
        if (playing) {
          stopSpeaking();
          setPlaying(false);
        } else {
          setPlaying(true);
          speak(text, lang, () => setPlaying(false));
        }
      }}
      aria-label={playing ? t("stop") : t("listen")}
      title={playing ? t("stop") : t("listen")}
    >
      {playing ? <Square size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
      {label && <span>{playing ? t("stop") : t("listen")}</span>}
    </button>
  );
}

export function MicButton({ onResult }: { onResult: (transcript: string) => void }) {
  const { lang, t } = useApp();
  const [ok, setOk] = useState(false);
  const [listening, setListening] = useState(false);
  const stopRef = useRef<() => void>(() => {});
  useEffect(() => setOk(canListen()), []);
  useEffect(() => () => stopRef.current(), []);
  if (!ok) return null;

  return (
    <button
      type="button"
      className={`btn btn-subtle btn-sm ${listening ? "is-recording" : ""}`}
      onClick={async () => {
        if (listening) return stopRef.current();
        stopSpeaking();
        setListening(true);
        const { promise, stop } = listenOnce(lang);
        stopRef.current = stop;
        const text = await promise;
        setListening(false);
        onResult(text);
      }}
    >
      <Mic size={16} aria-hidden />
      <span>{listening ? t("listening") : t("speak")}</span>
    </button>
  );
}
