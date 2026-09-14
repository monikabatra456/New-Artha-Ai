import React, { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Building2,
  Sparkles,
  Check,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { MatchedOpportunity } from "../types";

interface OpportunityCardProps {
  opportunity: MatchedOpportunity;
  onOpenDetails?: (opp: MatchedOpportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onOpenDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    document: doc,
    relevanceScore,
    relevanceTier,
    eligibilityStatus,
    whyMatched,
    whyMatches,
    actionRequired,
    priorityLevel,
  } = opportunity;

  const tierBadgeColor =
    relevanceTier === "Highly Relevant"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      : relevanceTier === "Relevant"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800";

  const priorityBadgeColor =
    priorityLevel === "HIGH"
      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300"
      : priorityLevel === "MEDIUM"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  const eligibilityBadgeColor =
    eligibilityStatus === "Likely eligible"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      : eligibilityStatus === "Needs verification"
      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800";

  const primaryMatchReason =
    whyMatched && whyMatched.length > 0 ? whyMatched[0] : whyMatches;

  return (
    <div className="msme-card relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300/80 sm:p-6">
      <div className="absolute inset-y-0 left-0 w-1 bg-[#1d4ed8]" aria-hidden="true" />
      {/* Top Header / Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Relevance Badge */}
          <button
            type="button"
            onClick={() => onOpenDetails && onOpenDetails(opportunity)}
            aria-label="View match breakdown"
            className={`inline-flex min-h-[28px] items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold transition hover:opacity-90 active:scale-95 ${tierBadgeColor}`}
          >
            <Sparkles className="h-3 w-3" />
            {relevanceScore}% Match
          </button>

          {/* Eligibility Status */}
          {eligibilityStatus && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${eligibilityBadgeColor}`}
            >
              {eligibilityStatus}
            </span>
          )}

          {/* Priority */}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${priorityBadgeColor}`}
          >
            {priorityLevel}
          </span>
        </div>

        {doc.deadline && (
          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Calendar className="h-3 w-3 text-slate-400" />
            {doc.deadline}
          </span>
        )}
      </div>

      {/* Opportunity Title */}
      <h3 className="font-display mt-3 text-base font-semibold leading-snug text-[#12233a] dark:text-white">
        {doc.title}
      </h3>

      {/* Department / Category */}
      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span>{doc.government_department}</span>
      </div>

      {/* One-Line Match Explanation */}
      <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        “{primaryMatchReason}”
      </p>

      {/* Inline Accordion Expanded Details */}
      {isExpanded && (
        <div className="mt-3.5 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950/60">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              Why this matched your profile:
            </span>
            <div className="mt-1.5 space-y-1">
              {whyMatched && whyMatched.length > 0 ? (
                whyMatched.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{reason}</span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-slate-700 dark:text-slate-300">{whyMatches}</div>
              )}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-900 dark:text-white">Stated Benefits:</span>
            <p className="mt-0.5 text-slate-600 dark:text-slate-300">{doc.benefits}</p>
          </div>

          <div>
            <span className="font-bold text-slate-900 dark:text-white">Next Action:</span>
            <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-200">{actionRequired}</p>
          </div>

          <div>
            <span className="font-bold text-slate-900 dark:text-white">Required Documents:</span>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-300">
              {doc.required_documents.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Source: <strong className="text-slate-700 dark:text-slate-300">{doc.official_source}</strong> • Record {doc.last_verified}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            if (onOpenDetails) {
              onOpenDetails(opportunity);
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
          className="flex min-h-[36px] items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {onOpenDetails ? (
            <>
              <span>View details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          ) : isExpanded ? (
            <>
              <span>Hide details</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>View details</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>

        <a
          href={doc.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="msme-btn min-h-[36px] px-3.5 py-1.5 text-xs"
        >
          <span>Official Portal</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
