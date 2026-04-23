import { Personality } from "./store";

let currentUtterance: SpeechSynthesisUtterance | null = null;
let lastSpokenKey: string | null = null;
let lastSpokenAt = 0;

export function speakText(
  text: string,
  personality: Personality,
  options?: { onStart?: () => void; onEnd?: () => void; key?: string },
) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

  // De-dupe: ignore identical requests fired within 800ms (covers StrictMode
  // double-invocation and accidental double triggers).
  const key = options?.key ?? text;
  const now = Date.now();
  if (key === lastSpokenKey && now - lastSpokenAt < 800) {
    return;
  }
  lastSpokenKey = key;
  lastSpokenAt = now;

  // Always cancel any pending/active speech before queuing new.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  if (personality === "Friendly") {
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
  } else if (personality === "Strict") {
    utterance.pitch = 0.9;
    utterance.rate = 0.95;
  } else {
    utterance.pitch = 1.0;
    utterance.rate = 1.0;
  }

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => {
    if (currentUtterance === utterance) currentUtterance = null;
    options?.onEnd?.();
  };
  utterance.onerror = () => {
    if (currentUtterance === utterance) currentUtterance = null;
    options?.onEnd?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function getSpeechRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  if (!Ctor) return null;
  return new Ctor() as SpeechRecognitionLike;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition,
  );
}
