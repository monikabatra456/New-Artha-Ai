import React from "react";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { DEMO_PROFILES } from "../data/demoProfiles";
import { BusinessProfile } from "../types";

interface DemoProfileBarProps {
  onSelectPreset: (profile: BusinessProfile) => void;
  currentIndustry?: string;
}

export const DemoProfileBar: React.FC<DemoProfileBarProps> = ({
  onSelectPreset,
  currentIndustry,
}) => {
  return (
    <div className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 p-4 shadow-2xs dark:border-blue-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
            DEMO MODE
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Instant MSME Presets for Pitch & Evaluation
          </h2>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Click any card to run verified RAG retrieval instantly
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_PROFILES.map((p) => {
          const isCurrent = currentIndustry === p.profile.industry;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p.profile)}
              className={`group flex flex-col items-start rounded-xl border p-3 text-left transition ${
                isCurrent
                  ? "border-blue-600 bg-white shadow-xs dark:border-blue-500 dark:bg-slate-800"
                  : "border-slate-200/90 bg-white/80 hover:border-blue-400 hover:bg-white dark:border-slate-750 dark:bg-slate-850 dark:hover:border-slate-600"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {p.name}
                </span>
                {isCurrent && (
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </div>
              <span className="mt-1 rounded bg-blue-100/70 px-1.5 py-0.2 text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {p.badge}
              </span>
              <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                {p.description}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                <span>Evaluate schemes</span>
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
