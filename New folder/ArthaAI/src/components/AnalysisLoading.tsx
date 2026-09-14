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
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60">
        <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
      </div>

      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
        BUILDING YOUR OPPORTUNITY MAP
      </h2>
      <p className="mt-1 mb-6 text-xs text-slate-500 dark:text-slate-400">
        Filtering verified MSME opportunities for your business...
      </p>

      {/* Staged Checklist */}
      <div className="w-full space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
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
