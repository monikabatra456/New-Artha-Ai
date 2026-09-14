import React from "react";
import {
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Building2,
  FileCheck2,
  IndianRupee,
  AlertTriangle,
  HelpCircle,
  Layers,
} from "lucide-react";
import { Logo } from "./Logo";
import { HeroAnimation } from "./HeroAnimation";

interface LandingPageProps {
  onStartOnboarding: () => void;
  onOpenDemoSheet: () => void;
  onOpenExplainModal: () => void;
  onOpenMonitorModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onOpenDemoSheet,
  onOpenExplainModal,
  onOpenMonitorModal,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-150 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Header / Navbar - Small ArthaAI logo on left, theme toggle on right */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo size="sm" showTagline={false} />

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Try a Demo Link */}
            <button
              onClick={onOpenDemoSheet}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              Try a demo
            </button>

            {/* Night / Day Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Launch Assessment CTA */}
            <button
              onClick={onStartOnboarding}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 sm:px-4"
            >
              <span>Check My Opportunities</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section — Minimal, Uncluttered, Focused */}
      <section className="relative px-4 pt-10 pb-12 sm:px-6 sm:pt-16 sm:pb-16">
        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>AI BUSINESS OFFICER FOR MSMEs</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl lg:leading-tight">
            Find the opportunities that fit your business.
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            ArthaAI matches your business profile with relevant opportunities, explains why they matter, and tells you what to do next.
          </p>

          {/* Primary CTA & Secondary Demo Link */}
          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            <button
              onClick={onStartOnboarding}
              id="start-assessment-button"
              className="flex min-h-[48px] w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] sm:w-auto"
            >
              <span>CHECK MY OPPORTUNITIES →</span>
            </button>

            <button
              onClick={onOpenDemoSheet}
              className="mt-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              TRY A DEMO →
            </button>

            {/* Small Trust Line */}
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Source-backed • Profile-aware • Action-oriented
            </p>
          </div>

          {/* Visual Product Preview / Hero Animation */}
          <HeroAnimation />
        </div>
      </section>

      {/* Core Opportunities Overview (Subtle, Clean) */}
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            Structured MSME Knowledge Base
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Mapped to official Central & State ministry schemes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Building2 className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                Public Procurement & Tenders
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Mandatory 25% MSME quotas on GeM with 100% Earnest Money Deposit (EMD) fee waivers.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <IndianRupee className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                Subsidies & Grants
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Up to 80% ZED certification reimbursement and PMEGP capital margin money grants.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                Collateral-Free Financing
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              CGTMSE bank credit guarantees up to ₹5 Crore with interest subvention linkages.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                Section 43B(h) Protection
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Statutory 45-day buyer payment mandates and MSME SAMADHAAN dispute filing.
            </p>
          </div>
        </div>

        {/* Why ArthaAI Link */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onOpenExplainModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Why ArthaAI?</span>
          </button>

          <button
            onClick={onOpenMonitorModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:underline dark:text-slate-400"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Knowledge Base Spec</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800">
        <p>ArthaAI • Your AI Business Officer for Indian MSMEs</p>
      </footer>
    </div>
  );
};
