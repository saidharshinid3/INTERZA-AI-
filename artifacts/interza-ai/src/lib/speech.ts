import { Personality } from "./store";

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, personality: Personality) {
  if (!window.speechSynthesis) return;

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

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
