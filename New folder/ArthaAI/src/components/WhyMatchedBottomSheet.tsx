import React from "react";
import { X, Check, HelpCircle, XCircle, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { MatchedOpportunity } from "../types";

interface WhyMatchedBottomSheetProps {
  opportunity: MatchedOpportunity | null;
  onClose: () => void;
}

export const WhyMatchedBottomSheet: React.FC<WhyMatchedBottomSheetProps> = ({
  opportunity,
  onClose,
}) => {
  if (!opportunity) return null;

  const {
    document: doc,
    relevanceScore,
    relevanceTier,
    eligibilityStatus,
    requirementChecks,
    whyMatched,
    whyMatches,
    scoreBreakdown,
    actionRequired,
    priorityLevel,
  } = opportunity;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs">
      <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Sparkles className="h-3 w-3" />
                {relevanceScore} / 100 • {relevanceTier}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {priorityLevel} Priority
              </span>
              {eligibilityStatus && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    eligibilityStatus === "Likely eligible"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : eligibilityStatus === "Needs verification"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  }`}
                >
                  Eligibility: {eligibilityStatus}
                </span>
              )}
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
              {doc.title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {doc.government_department}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Individual Criteria Evaluation (PASS / FAIL / UNKNOWN) */}
          {requirementChecks && requirementChecks.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Requirements Evaluation
              </h4>
              <div className="mt-2.5 divide-y divide-slate-100 text-[11px] dark:divide-slate-800">
                {requirementChecks.map((chk, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {chk.criterion}
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {chk.details}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        chk.status === "PASS"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : chk.status === "FAIL"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {chk.status === "PASS" && <Check className="h-3 w-3" />}
                      {chk.status === "FAIL" && <XCircle className="h-3 w-3" />}
                      {chk.status === "UNKNOWN" && <HelpCircle className="h-3 w-3" />}
                      {chk.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why This Matches Profile */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
            <h4 className="font-bold text-blue-950 dark:text-blue-200">
              Deterministic Matching Factors
            </h4>
            <div className="mt-2 space-y-1.5">
              {whyMatched && whyMatched.length > 0 ? (
                whyMatched.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{reason}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-700 dark:text-slate-300">{whyMatches}</div>
              )}
            </div>
          </div>

          {/* 6-Factor Deterministic Score Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
            <h4 className="font-bold text-slate-900 dark:text-white">
              6-Factor Score Weights
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Industry: <strong>{scoreBreakdown.industryScore}/30</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Size: <strong>{scoreBreakdown.sizeScore}/20</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-600" />
                <span>State: <strong>{scoreBreakdown.locationScore}/15</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Udyam: <strong>{scoreBreakdown.udyamScore}/10</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Eligibility: <strong>{scoreBreakdown.eligibilityScore}/20</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-600" />
                <span>Recency: <strong>{scoreBreakdown.recencyScore}/5</strong></span>
              </div>
            </div>
          </div>

          {/* Stated Benefits */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Stated Benefits</h4>
            <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
              {doc.benefits}
            </p>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Required Documents</h4>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-300">
              {doc.required_documents.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          {/* Next Action */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Recommended Next Action</h4>
            <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
              {actionRequired}
            </p>
          </div>

          {/* Verification Footnote */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Source: {doc.official_source}
            </span>
            <span>Record date: {doc.last_verified}</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
          <a
            href={doc.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
          >
            <span>View Official Source</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
