import React from "react";
import {
  ArrowRight,
  Sun,
  Moon,
  Building2,
  FileCheck2,
  IndianRupee,
  AlertTriangle,
  HelpCircle,
  Layers,
  Factory,
  BadgeCheck,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "./Logo";
import { HeroAnimation } from "./HeroAnimation";
import { ChatAssistantPanel } from "./ChatAssistantPanel";
import { BusinessProfile } from "../types";

interface LandingPageProps {
  onStartOnboarding: () => void;
  onOpenDemoSheet: () => void;
  onOpenExplainModal: () => void;
  onOpenMonitorModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  businessProfile?: BusinessProfile;
  onProfileExtracted?: (extracted: Partial<BusinessProfile>) => void;
}

const TRUST_CHIPS = [
  "GeM 25% MSME quota",
  "CGTMSE credit",
  "ZED / ISO subsidy",
  "Udyam & GST",
  "43B(h) payments",
];

const STATS = [
  { value: "23", label: "Verified scheme records" },
  { value: "6", label: "Opportunity categories" },
  { value: "48", label: "Official source portals" },
  { value: "0", label: "Invented scheme names" },
];

const STEPS = [
  {
    n: "01",
    title: "Tell us about your unit",
    body: "Industry, size, Udyam and state — or upload your certificate. Takes under a minute.",
    icon: ClipboardList,
  },
  {
    n: "02",
    title: "We match official schemes",
    body: "Scored against verified Central & State records — not a generic internet list.",
    icon: BadgeCheck,
  },
  {
    n: "03",
    title: "You get this week’s actions",
    body: "What to apply for, which documents to keep ready, and the official portal to use.",
    icon: ShieldCheck,
  },
];

const MATCH_AREAS = [
  {
    title: "Public tenders on GeM",
    body: "Mandatory 25% MSME quota, EMD waiver, and reserved railway / defence / IT tenders.",
    icon: Building2,
    tone: "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300",
  },
  {
    title: "Subsidies & grants",
    body: "ZED certification reimbursement, PMEGP margin money, PMFME and textile SAMARTH support.",
    icon: IndianRupee,
    tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
  },
  {
    title: "Collateral-free credit",
    body: "CGTMSE bank guarantees, MUDRA, TReDS invoice discounting — without third-party collateral.",
    icon: FileCheck2,
    tone: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300",
  },
  {
    title: "45-day payment protection",
    body: "Section 43B(h) buyer payment rules and MSME SAMADHAAN delayed-payment filing.",
    icon: AlertTriangle,
    tone: "bg-amber-50 text-[#c45c26] dark:bg-amber-950/70 dark:text-amber-300",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onOpenDemoSheet,
  onOpenExplainModal,
  onOpenMonitorModal,
  darkMode,
  onToggleDarkMode,
  businessProfile,
  onProfileExtracted,
}) => {
  return (
    <div className="page-canvas min-h-screen text-slate-900 transition-colors duration-200 dark:text-slate-100">
      <div className="tricolor-bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Logo size="md" showTagline={false} />

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
            <a href="#how-it-works" className="hover:text-[#12233a] dark:hover:text-white">
              How it works
            </a>
            <a href="#what-we-match" className="hover:text-[#12233a] dark:hover:text-white">
              What we match
            </a>
            <a href="#assistant" className="hover:text-[#12233a] dark:hover:text-white">
              Ask an officer
            </a>
            <button onClick={onOpenDemoSheet} className="hover:text-[#12233a] dark:hover:text-white">
              Sample unit
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            <button onClick={onStartOnboarding} className="msme-btn px-3.5 py-2.5 text-xs sm:px-4 sm:text-sm">
              <span>Check my unit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <section className="relative px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-[#e8f2ff] px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
              <Factory className="h-3.5 w-3.5 text-[#c45c26]" />
              <span>For Indian MSME owners</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-slate-500 dark:text-slate-400">Micro · Small · Medium</span>
            </div>

            <h1 className="font-display mt-5 text-[2.15rem] font-semibold leading-[1.12] text-[#12233a] dark:text-white sm:text-5xl lg:text-[3.15rem]">
              Tenders, subsidies and bank credit that actually fit your unit.
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-slate-600 dark:text-slate-300">
              Enter your industry, size, Udyam and state. ArthaAI matches official GeM tenders,
              subsidies, collateral-free loans and 45-day payment rules — then tells you what to do
              this week.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={onStartOnboarding}
                id="start-assessment-button"
                className="msme-btn min-h-[52px] px-7 text-[15px]"
              >
                Check my opportunities
                <ArrowRight className="h-4 w-4" />
              </button>

              <button onClick={onOpenDemoSheet} className="msme-btn-ghost min-h-[52px] px-5">
                Open a sample unit
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {TRUST_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-sky-200 bg-[#e8f2ff] px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <HeroAnimation />
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="msme-card px-4 py-4 text-center sm:py-5">
              <p className="font-display text-2xl font-semibold text-[#12233a] dark:text-white sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-medium leading-snug text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#12233a] dark:text-white sm:text-4xl">
            Built the way a business owner thinks
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="msme-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12233a] text-white dark:bg-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-2xl font-semibold text-slate-200 dark:text-slate-700">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{step.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="what-we-match" className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">What we match</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#12233a] dark:text-white sm:text-4xl">
            Money, tenders and protection — in one desk
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Mapped to official Central & State ministry schemes. Always apply on the source portal.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MATCH_AREAS.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.title} className="msme-card p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${area.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{area.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{area.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-start gap-6">
          <button
            onClick={onOpenExplainModal}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1d4ed8] hover:underline dark:text-blue-400"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Why trust this match?</span>
          </button>

          <button
            onClick={onOpenMonitorModal}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:underline dark:text-slate-400"
          >
            <Layers className="h-4 w-4" />
            <span>Schemes we cover</span>
          </button>
        </div>
      </section>

      <div id="assistant">
        <ChatAssistantPanel
          variant="hero"
          businessProfile={businessProfile}
          onProfileExtracted={onProfileExtracted}
        />
      </div>

      <footer className="mt-8 border-t border-slate-200/80 py-10 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <Logo size="md" showTagline />
            <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Not a government portal. We match your unit to official scheme records. Always confirm
              eligibility and apply on the ministry’s own website.
            </p>
          </div>
          <p className="text-xs text-slate-400">ArthaAI · AI business officer for Indian MSMEs</p>
        </div>
      </footer>
    </div>
  );
};
