import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, IndianRupee, FileCheck2, CheckCircle2, ShieldCheck } from "lucide-react";

export const HeroAnimation: React.FC = () => {
  // Stage 0: Information Converging -> Stage 1: Filtered Matches -> Stage 2: 3 Prioritized Actions
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 3);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-3xl border border-sky-200 bg-[#e8f2ff] p-5 dark:border-slate-800 dark:bg-slate-900/90 sm:p-6">
      {/* Header bar */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            {phase === 0
              ? "Finding Relevant Opportunities"
              : phase === 1
              ? "Matching Your Business Profile"
              : "Preparing Your Next Actions"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${phase === 0 ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`} />
          <span className={`h-1.5 w-1.5 rounded-full ${phase === 1 ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`} />
          <span className={`h-1.5 w-1.5 rounded-full ${phase === 2 ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`} />
        </div>
      </div>

      {/* Animation Canvas */}
      <div className="relative min-h-[190px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Phase 0: Fragmented Information Converging */}
          {phase === 0 && (
            <motion.div
              key="phase-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="w-full space-y-2"
            >
              <div className="text-center mb-2">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Step 1: Structured Knowledge Base
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="mt-1 text-[11px] font-bold text-slate-800 dark:text-slate-200">GeM Tenders</span>
                  <span className="text-[9px] text-slate-400">25% MSME Quotas</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="mt-1 text-[11px] font-bold text-slate-800 dark:text-slate-200">Subsidies</span>
                  <span className="text-[9px] text-slate-400">Up to 80% ZED / Capital</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <FileCheck2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="mt-1 text-[11px] font-bold text-slate-800 dark:text-slate-200">Financing</span>
                  <span className="text-[9px] text-slate-400">CGTMSE Collateral-Free</span>
                </motion.div>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Matching with your business size, industry & location</span>
              </div>
            </motion.div>
          )}

          {/* Phase 1: 3 Highly Relevant Matched Opportunities */}
          {phase === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="w-full space-y-2"
            >
              <div className="text-center mb-1">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Step 2: Filtered & Verified Matches
                </span>
              </div>

              {[
                { title: "GeM EMD Exemption & 25% Quota", tag: "Tender", score: "94%", color: "text-blue-600" },
                { title: "ZED Sustainable Subsidy (60-80%)", tag: "Subsidy", score: "91%", color: "text-emerald-600" },
                { title: "CGTMSE ₹5 Cr Collateral-Free Loan", tag: "Credit", score: "89%", color: "text-indigo-600" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.tag}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${item.color}`}>{item.score} Match</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Phase 2: Prioritized Action Plan */}
          {phase === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="w-full space-y-2"
            >
              <div className="text-center mb-1">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Step 3: Clear Actionable Next Steps
                </span>
              </div>

              {[
                { step: "1. Download Udyam Certificate for GeM 0-EMD bidding", time: "Today" },
                { step: "2. Claim 80% ZED audit subsidy voucher on portal", time: "This Week" },
                { step: "3. Apply to member bank for CGTMSE guarantee", time: "Next" },
              ].map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 dark:border-blue-950/70 dark:bg-blue-950/30"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-slate-900 dark:text-white">
                      {action.step}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {action.time}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust footline */}
      <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Source-backed • Profile-aware • Action-oriented</span>
      </div>
    </div>
  );
};
