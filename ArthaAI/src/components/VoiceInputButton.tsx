import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  /** Default 'en-US'. Pass 'hi-IN' for Hindi SpeechRecognition. */
  lang?: string;
  title?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * Browser-native speech-to-text (Web Speech API). Does not call Gemini.
 * Transcribed text is returned via onTranscript for the user to review/edit —
 * this button never auto-submits.
 */
export function VoiceInputButton({
  onTranscript,
  className = "",
  lang = "en-US",
  title = "Speak to type",
  disabled = false,
}: VoiceInputButtonProps) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);

  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    try {
      const recog = new SpeechRecognitionAPI();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = lang;

      recog.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };

      recog.onresult = (event: any) => {
        setIsListening(false);
        setIsProcessing(true);
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcriptText = event.results[0][0].transcript;
          if (transcriptText) {
            onTranscriptRef.current(transcriptText);
          }
        }
        setIsProcessing(false);
      };

      recog.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setIsProcessing(false);
      };

      recog.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current = recog;
      setIsSupported(true);

      return () => {
        try {
          recog.stop();
        } catch {
          /* ignore */
        }
        recognitionRef.current = null;
      };
    } catch (err) {
      console.warn("Failed to initialize SpeechRecognition:", err);
      setIsSupported(false);
    }
  }, [lang]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSupported || !recognitionRef.current || disabled) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
      }
    }
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input is not supported by your browser"
        className={`p-2 rounded-lg text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-60 transition-all ${className}`}
      >
        <MicOff className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      title={
        disabled
          ? "Voice input unavailable"
          : isListening
          ? "Listening... Click to stop"
          : title
      }
      className={`relative p-2 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
        isListening
          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse"
          : isProcessing
          ? "bg-amber-500 text-white"
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600"
      } ${className}`}
    >
      {isListening ? (
        <>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <Mic className="w-4 h-4 animate-bounce" />
        </>
      ) : isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
