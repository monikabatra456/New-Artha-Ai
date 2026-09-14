import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  AlertCircle,
  Clock,
  HelpCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { BusinessProfile } from "../types";
import { sendAssistantChat, ChatMessage } from "../services/apiClient";
import { VoiceInputButton } from "./VoiceInputButton";

interface ChatAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  businessProfile?: BusinessProfile;
}

const DEFAULT_CHIPS = [
  "Why do I need Udyam registration?",
  "What documents do I need for CGTMSE?",
  "How does Section 43B(h) payment protection work?",
  "Am I eligible for GeM EMD waivers?",
];

export function ChatAssistantPanel({ isOpen, onClose, businessProfile }: ChatAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Namaste! I am your ArthaAI Sovereign Opportunities Assistant. Ask me anything about MSME schemes, Udyam registration, subsidies, compliance, or collateral-free loans.",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("en-US");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputText).trim();
    if (!text || isLoading) return;

    setErrorState(null);
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    const historyForApi = messages.slice(-6); // Send recent conversation context

    const result = await sendAssistantChat(text, historyForApi, businessProfile);

    setIsLoading(false);
    if (result.response) {
      setMessages((prev) => [...prev, { role: "assistant", content: result.response! }]);
    } else {
      const errorMsg =
        result.code === "RATE_LIMIT"
          ? "AI assistant is temporarily busy, try again in a moment."
          : result.error || "AI assistant is currently unavailable.";
      setErrorState(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMsg}`,
        },
      ]);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                ArthaAI Assistant
                <span className="text-[10px] bg-emerald-400/30 border border-emerald-300/40 text-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  Sovereign RAG
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80">
                Grounded in verified MSME knowledge base
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorState && (
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

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((msg, index) => {
            const isAssistant = msg.role === "assistant";
            return (
              <div
                key={index}
                className={`flex space-x-3 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isAssistant
                      ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                      : "bg-emerald-600 text-white rounded-tr-none font-medium"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                {!isAssistant && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex space-x-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
                <span className="text-xs">Consulting MSME knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Chips */}
        {messages.length < 5 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-emerald-500" />
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  disabled={isLoading}
                  className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 transition-colors text-left flex items-center gap-1 disabled:opacity-50"
                >
                  <span>{chip}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-2">
            {/* Language Toggle for Voice */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 focus:outline-none"
              title="Voice Recognition Language"
            >
              <option value="en-US">EN</option>
              <option value="hi-IN">HI (हिंदी)</option>
            </select>

            {/* Voice Input Microphone Button */}
            <VoiceInputButton
              onTranscript={handleVoiceTranscript}
              lang={selectedLang}
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
              placeholder="Ask about schemes, Udyam, loans..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent dark:border-slate-700"
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
            ArthaAI Assistant uses Gemini AI grounded in verified government data.
          </p>
        </div>
      </div>
    </div>
  );
}
