import React from "react";
import {
  X,
  CheckCircle2,
  ExternalLink,
  Building2,
  Layers,
  Clock,
} from "lucide-react";

interface OpportunityMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityMonitorModal: React.FC<OpportunityMonitorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentSources = [
    {
      portal: "Government e-Marketplace (GeM)",
      coverage: "Mandatory 25% MSME Quotas & 100% EMD Waivers",
      status: "Verified in Knowledge Base",
      url: "https://gem.gov.in",
    },
    {
      portal: "Udyam & MSME SAMADHAAN",
      coverage: "Section 43B(h) & 45-day payment dispute settlement",
      status: "Verified in Knowledge Base",
      url: "https://samadhaan.msme.gov.in",
    },
    {
      portal: "Central Public Procurement Portal (CPPP)",
      coverage: "Central Ministry & PSU tender preferential purchase rules",
      status: "Verified in Knowledge Base",
      url: "https://eprocure.gov.in",
    },
    {
      portal: "DGFT Foreign Trade Policy (2023-28)",
      coverage: "RoDTEP rates, export duty drawbacks & trade fair grants",
      status: "Verified in Knowledge Base",
      url: "https://dgft.gov.in",
    },
    {
      portal: "Ministry of MSME & SIDBI (CGTMSE)",
      coverage: "₹5 Cr collateral-free credit guarantees & 80% ZED subsidies",
      status: "Verified in Knowledge Base",
      url: "https://www.cgtmse.in",
    },
  ];

  const plannedPipeline = [
    {
      feature: "Live GeM Tender Feeds",
      desc: "Instant matching and notification when a public tender matching your exact NIC code is published.",
    },
    {
      feature: "E-Gazette Daily Monitoring",
      desc: "Automated ingestion parsing daily notifications from gazette.nic.in for changes in MSME benefits.",
    },
    {
      feature: "State Industrial Policy Updates",
      desc: "Updates on state-specific power tariff concessions, capital subsidies, and stamp duty waivers.",
    },
    {
      feature: "Proactive Deadline Reminders",
      desc: "Targeted alerts 14, 7, and 2 days before subsidy tranches or tender submission deadlines close.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Layers className="h-3 w-3" />
            Knowledge Base & Data Pipeline Architecture
          </div>
          <h2 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
            How ArthaAI Stays Updated
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            ArthaAI is built on a deterministic RAG (Retrieval-Augmented Generation) foundation grounded in statutory government orders.
          </p>
        </div>

        {/* Available Now */}
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Available Now (Verified Statutory Knowledge Base)</span>
            </div>
            <span className="rounded bg-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
              Central & State Sources
            </span>
          </div>

          <div className="mt-3 divide-y divide-emerald-200/60 text-xs dark:divide-emerald-900/40">
            {currentSources.map((src, idx) => (
              <div key={idx} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">{src.portal}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span>{src.coverage}</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planned Automated Ingestion */}
        <div className="mt-5 rounded-xl border border-blue-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Continuous Monitoring Pipeline (Roadmap)</span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
            {plannedPipeline.map((pipe, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <p className="font-bold text-slate-900 dark:text-white">{pipe.feature}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {pipe.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
