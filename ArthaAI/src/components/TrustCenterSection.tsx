import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

export const TrustCenterSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pipelineSteps = [
    { title: "Business Profile", desc: "Industry, size, location, and Udyam status normalized into structured attributes." },
    { title: "Knowledge Base", desc: "Verified schemes retrieved from official Central and State gazette schemas." },
    { title: "Matching & Scoring", desc: "6-factor deterministic scoring calculates eligibility fit (0–100%)." },
    { title: "Evidence Assembly", desc: "Only retrieved statutory documents are packaged as verified evidence." },
    { title: "AI Synthesis", desc: "Gemini summarizes and explains evidence without hallucinating facts." },
    { title: "Action Plan", desc: "Generates Top 3 immediate actions and step-by-step checklist with official URLs." },
  ];

  return (
    <div className="msme-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              How ArthaAI Works
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic RAG pipeline grounded in statutory government sources
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-[36px] items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>{isOpen ? "Hide Architecture" : "View Pipeline Details →"}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            <strong className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Core Principle: ArthaAI does not treat AI-generated text as the source of truth.
            </strong>
            <p className="mt-1 text-[11px] text-emerald-900 dark:text-emerald-300">
              Every scheme, grant amount, deadline, eligibility rule, and official URL is retrieved directly from our structured, verified government knowledge base.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {pipelineSteps.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">{s.title}</h4>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
