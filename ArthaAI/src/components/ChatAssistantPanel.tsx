import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Mic,
  FileUp,
} from "lucide-react";
import { BusinessProfile } from "../types";
import { sendAssistantChat, getAssistantAvailability, ChatMessage } from "../services/apiClient";
import { VoiceInputButton } from "./VoiceInputButton";
import { DocumentUploadSection } from "./DocumentUploadSection";

interface ChatAssistantPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  businessProfile?: BusinessProfile;
  variant?: "drawer" | "hero";
  onProfileExtracted?: (extracted: Partial<BusinessProfile>) => void;
}

const DEFAULT_CHIPS = [
  "Why do I need Udyam registration?",
  "What documents do I need for CGTMSE?",
  "How does Section 43B(h) payment protection work?",
  "Am I eligible for GeM EMD waivers?",
];

export function ChatAssistantPanel({
  isOpen = true,
  onClose,
  businessProfile,
  variant = "drawer",
  onProfileExtracted,
}: ChatAssistantPanelProps) {
  const isHero = variant === "hero";
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Namaste. I am your MSME desk officer. Ask about Udyam, CGTMSE documents, GeM EMD waivers, or 45-day payment rules. Upload a certificate if you want answers tailored to your unit.",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("en-US");
  const [assistantAvailable, setAssistantAvailable] = useState<boolean | null>(null);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendLockRef = useRef<boolean>(false);

  const active = isHero || isOpen;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (active) scrollToBottom();
  }, [messages, active]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    getAssistantAvailability().then((result) => {
      if (!cancelled) setAssistantAvailable(result.available);
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  if (!isHero && !isOpen) return null;

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputText).trim();
    if (!text || isLoading || sendLockRef.current || assistantAvailable === false) return;

    sendLockRef.current = true;
    setErrorState(null);
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    const historyForApi = messages.slice(-6);
    const result = await sendAssistantChat(text, historyForApi, businessProfile);

    setIsLoading(false);
    sendLockRef.current = false;

    if (result.response) {
      setMessages((prev) => [...prev, { role: "assistant", content: result.response! }]);
      return;
    }

    if (result.code === "AI_UNAVAILABLE") {
      setAssistantAvailable(false);
      setErrorState("AI assistant unavailable");
      return;
    }

    const errorMsg =
      result.code === "RATE_LIMIT"
        ? "AI assistant is temporarily busy, try again in a moment."
        : result.error || "AI assistant is currently unavailable.";
    setErrorState(errorMsg);
    setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${errorMsg}` }]);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const chatBody = (
    <>
      {errorState && assistantAvailable !== false && (
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{errorState}</span>
          </div>
          <button
            onClick={() => setErrorState(null)}
            className="text-xs underline font-semibold hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {isHero && showUpload && onProfileExtracted && (
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <DocumentUploadSection onProfileExtracted={onProfileExtracted} />
        </div>
      )}

      {assistantAvailable === false ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-950/50">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
            AI assistant unavailable
          </h4>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Gemini is not configured on this server. You can still match schemes without AI. Set{" "}
            <span className="font-mono text-xs">GEMINI_API_KEY</span> to enable chat.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`flex-1 space-y-4 overflow-y-auto bg-[#f3f8ff] p-4 dark:bg-slate-950/50 ${
              isHero ? "min-h-[280px] sm:min-h-[360px]" : ""
            }`}
          >
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex space-x-3 ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  {isAssistant && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12233a] text-white shadow-sm dark:bg-blue-600">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                      isAssistant
                        ? "rounded-tl-none border border-slate-200/90 bg-white text-slate-800 shadow-[0_1px_2px_rgba(18,35,58,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        : "rounded-tr-none bg-[#1d4ed8] font-medium text-white shadow-[0_6px_16px_rgba(29,78,216,0.18)]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {!isAssistant && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-200">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start space-x-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12233a] text-white shadow-sm dark:bg-blue-600">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <div className="flex items-center space-x-2 rounded-2xl rounded-tl-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  <span className="flex space-x-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.4s]" />
                  </span>
                  <span className="text-xs">Consulting MSME knowledge base…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length < 6 && (
            <div className="border-t border-sky-100 bg-[#e8f2ff] p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <HelpCircle className="h-3 w-3 text-blue-600" />
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    disabled={isLoading}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-xs text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <span>{chip}</span>
                    <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center space-x-2">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={isLoading || assistantAvailable === false}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            title="Voice Recognition Language"
          >
            <option value="en-US">EN</option>
            <option value="hi-IN">HI (हिंदी)</option>
          </select>

          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
            lang={selectedLang}
            disabled={isLoading || assistantAvailable === false}
            title={`Speak in ${selectedLang === "hi-IN" ? "Hindi" : "English"}`}
          />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              assistantAvailable === false
                ? "AI assistant unavailable"
                : "Ask about Udyam, CGTMSE, GeM, 43B(h)…"
            }
            disabled={isLoading || assistantAvailable === false}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim() || assistantAvailable === false}
            className="flex shrink-0 items-center justify-center rounded-xl bg-[#1d4ed8] p-2.5 text-white shadow-md transition-all hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
          Gemini answers only from verified MSME scheme records. Matching still works if Gemini is busy.
        </p>
      </div>
    </>
  );

  if (isHero) {
    return (
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 max-w-2xl">
            <p className="eyebrow">Ask an officer</p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#12233a] dark:text-white sm:text-4xl">
              Questions about Udyam, CGTMSE or GeM — answered from our records
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              English or Hindi. Type, speak, or upload a certificate. Answers stay inside verified scheme records.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-sky-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-[#12233a] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-white/15 bg-white/10 p-2.5">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-tight">MSME desk assistant</h3>
                  <p className="mt-0.5 text-xs text-slate-300 sm:text-sm">
                    Grounded replies · official sources only
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
                  Gemini + knowledge base
                </span>
                {onProfileExtracted && (
                  <button
                    type="button"
                    onClick={() => setShowUpload((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    <FileUp className="h-3.5 w-3.5" />
                    {showUpload ? "Hide upload" : "Upload Udyam / GST"}
                  </button>
                )}
                <span className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
                  <Mic className="h-3.5 w-3.5" />
                  Voice ready
                </span>
              </div>
            </div>
            <div className="flex min-h-[480px] flex-col sm:min-h-[540px]">{chatBody}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-slate-900/60 backdrop-blur-sm">
      <div
        className="flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-[#12233a] px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl border border-white/15 bg-white/10 p-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold leading-tight">
                ArthaAI Assistant
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                  For your unit
                </span>
              </h3>
              <p className="text-xs text-slate-300">Grounded in verified MSME knowledge base</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              title="Close Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{chatBody}</div>
      </div>
    </div>
  );
}
