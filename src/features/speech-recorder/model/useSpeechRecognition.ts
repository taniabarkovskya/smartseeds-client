import { useState } from "react";

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionCtor | undefined {
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] || w["webkitSpeechRecognition"]) as
    | SpeechRecognitionCtor
    | undefined;
}

export function useSpeechRecognition(lang = "uk-UA") {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = () => {
    const SpeechRecognitionAPI = getSpeechRecognition();

    if (!SpeechRecognitionAPI) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      setTranscript(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setError("Recognition failed. Check your microphone.");
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
    setError(null);
    setTranscript("");
  };

  const reset = () => {
    setTranscript("");
    setError(null);
  };

  return { transcript, isListening, error, start, reset };
}
