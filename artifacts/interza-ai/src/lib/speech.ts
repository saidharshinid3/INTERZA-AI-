import { Personality } from "./store";

let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeKey: string | null = null;

function configureUtterance(
  utterance: SpeechSynthesisUtterance,
  personality: Personality,
) {
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
}

/**
 * Speak `text` using SpeechSynthesis.
 * - HARD-cancels any prior speech first.
 * - If the same `key` is already being spoken (or queued), the new request is
 *   ignored to prevent overlap/echo.
 * - Pass `force: true` (e.g. for the Replay button) to bypass the same-key
 *   guard.
 */
export function speakText(
  text: string,
  personality: Personality,
  options?: {
    key?: string;
    force?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
  },
) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;
  const key = options?.key ?? text;

  // If the same key is currently active (speaking or queued), do nothing.
  if (!options?.force && activeKey === key && (synth.speaking || synth.pending)) {
    return;
  }

  // Hard stop anything previously speaking/queued.
  synth.cancel();
  activeUtterance = null;
  activeKey = null;

  const utterance = new SpeechSynthesisUtterance(text);
  configureUtterance(utterance, personality);

  utterance.onstart = () => {
    options?.onStart?.();
  };
  const finalize = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
      activeKey = null;
    }
    options?.onEnd?.();
  };
  utterance.onend = finalize;
  utterance.onerror = finalize;

  activeUtterance = utterance;
  activeKey = key;

  // Defer to next tick so any in-flight cancel() fully drains in Chrome.
  setTimeout(() => {
    if (activeUtterance === utterance) {
      synth.speak(utterance);
    }
  }, 0);
}

export function cancelSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  activeUtterance = null;
  activeKey = null;
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
