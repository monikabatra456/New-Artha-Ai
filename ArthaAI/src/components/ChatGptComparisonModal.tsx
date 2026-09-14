import React from "react";
import { X, Check, ShieldCheck, Sparkles } from "lucide-react";

interface ChatGptComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatGptComparisonModal: React.FC<ChatGptComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const comparisonRows = [
    {
      feature: "Profile-Aware",
      generalAi: "Requires re-prompting context every session with no persistent entity model.",
      arthaAi: "Maintains structured MSME entity model (Udyam, turnover, industry, state jurisdiction).",
    },
    {
      feature: "Source-Backed",
      generalAi: "May summarize without source verification or produce outdated guidelines.",
      arthaAi: "Grounded in structured MSME knowledge base mapped to official department records.",
    },
    {
      feature: "Prioritized Scoring",
      generalAi: "Provides generic lists without transparent mathematical eligibility calculation.",
      arthaAi: "Calculates transparent 6-factor relevance scores (0–100%) against industry and size rules.",
    },
    {
      feature: "Statutory Directives",
      generalAi: "Often overlooks practical MSME protections like Section 43B(h) or GeM EMD waivers.",
      arthaAi: "Surfaces statutory cash-flow protections, EMD fee waivers, and public purchase quotas.",
    },
    {
      feature: "Action-Oriented",
      generalAi: "Outputs unstructured text blocks without direct execution links.",
      arthaAi: "Provides prioritized Top 3 actions with official application links and document checklists.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close comparison"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            Product Comparison
          </div>
          <h2 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
            Why ArthaAI?
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
            <strong className="text-slate-900 dark:text-white">
              "General AI can answer a question. ArthaAI turns a business profile into a prioritized opportunity feed."
            </strong>
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-12 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <div className="col-span-3">Dimension</div>
            <div className="col-span-4 text-slate-500 dark:text-slate-400">General AI Chat</div>
            <div className="col-span-5 text-blue-600 dark:text-blue-400">ArthaAI (RAG Pipeline)</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {comparisonRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 items-start gap-2 p-3 text-xs sm:p-4">
                <div className="col-span-3 font-semibold text-slate-900 dark:text-white">
                  {row.feature}
                </div>
                <div className="col-span-4 text-slate-500 dark:text-slate-400">
                  <span>{row.generalAi}</span>
                </div>
                <div className="col-span-5 flex items-start gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{row.arthaAi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
          <div className="flex items-center gap-2 font-bold text-blue-950 dark:text-blue-100">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Built for Indian MSMEs</span>
          </div>
          <p className="mt-1">
            ArthaAI combines structured opportunity retrieval, business-specific matching, transparent scoring, source evidence, and actionable workflow.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            Got it, back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
