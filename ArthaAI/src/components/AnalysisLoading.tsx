import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";

interface AnalysisLoadingProps {
  onComplete?: () => void;
}

const STAGES = [
  "Understanding your business",
  "Finding relevant opportunities",
  "Checking business fit",
  "Prioritizing what matters",
  "Preparing your next actions",
];

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return prev;
        }
      });
    }, 500);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="mx-auto flex min-h-[420px] max-w-md flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#12233a] text-white shadow-[0_10px_28px_rgba(18,35,58,0.22)]">
        <Sparkles className="h-7 w-7 animate-pulse text-amber-300" />
      </div>

      <h2 className="font-display text-2xl font-semibold text-[#12233a] dark:text-white sm:text-3xl">
        Matching schemes to your unit
      </h2>
      <p className="mt-2 mb-7 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Checking tenders, subsidies, credit and payment rules for your profile…
      </p>

      <div className="msme-card w-full space-y-3 p-5 text-left">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2.5 text-xs transition-colors ${
                isDone
                  ? "text-slate-800 font-medium dark:text-slate-200"
                  : isCurrent
                  ? "text-blue-600 font-bold dark:text-blue-400"
                  : "text-slate-400 dark:text-slate-600"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-600 dark:text-blue-400" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border border-slate-300 dark:border-slate-700" />
              )}
              <span>{stage}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Grounded in Structured MSME Knowledge Base</span>
      </div>
    </div>
  );
};
