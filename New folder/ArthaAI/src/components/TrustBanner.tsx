import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface TrustBannerProps {
  profile: {
    industry: string;
    size: string;
    state: string;
    udyamStatus: string;
  };
  totalVerified: number;
  highlyRelevant: number;
  onOpenExplain?: () => void;
}

export const TrustBanner: React.FC<TrustBannerProps> = ({
  profile,
  totalVerified,
  highlyRelevant,
  onOpenExplain,
}) => {
  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-emerald-50/60 p-4 shadow-2xs dark:border-blue-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Why these recommendations?
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                Verified RAG Pipeline
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              Matched against <strong className="text-slate-900 dark:text-white">{totalVerified} verified official schemes</strong> ({highlyRelevant} highly relevant).
            </p>
          </div>
        </div>

        {onOpenExplain && (
          <button
            onClick={onOpenExplain}
            className="flex items-center gap-1.5 self-start rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs transition hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-800 dark:text-blue-400 sm:self-center"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Why ArthaAI?</span>
          </button>
        )}
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3 text-[11px] text-slate-700 dark:border-slate-800 dark:text-slate-300 sm:grid-cols-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Industry: <strong className="text-slate-900 dark:text-white">{profile.industry}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Size: <strong className="text-slate-900 dark:text-white">{profile.size}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Location: <strong className="text-slate-900 dark:text-white">{profile.state}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span>Udyam: <strong className="text-slate-900 dark:text-white">{profile.udyamStatus === "registered" ? "Active" : "Pending"}</strong></span>
        </div>
      </div>
    </div>
  );
};
