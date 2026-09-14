import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  Building2,
  SlidersHorizontal,
  Layers,
  FileCheck2,
  IndianRupee,
  Award,
  AlertTriangle,
  AlertCircle,
  Globe,
  Sun,
  Moon,
  Search,
  ShieldCheck,
  ArrowUpDown,
  Terminal,
  ChevronDown,
  Edit3,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import {
  BusinessProfile,
  AnalysisResult,
  OpportunityCategory,
  MatchedOpportunity,
} from "./types";
import {
  OnboardingProgressBar,
  StepIndustry,
  StepSize,
  StepUdyam,
  StepLocation,
  StepConfirmation,
} from "./components/OnboardingSteps";
import { Logo } from "./components/Logo";
import { LandingPage } from "./components/LandingPage";
import { DemoBottomSheet } from "./components/DemoBottomSheet";
import { WhyMatchedBottomSheet } from "./components/WhyMatchedBottomSheet";
import { SortBottomSheet, SortOption } from "./components/SortBottomSheet";
import { TrustCenterSection } from "./components/TrustCenterSection";
import { ActionPlanSection } from "./components/ActionPlanSection";
import { OpportunityCard } from "./components/OpportunityCard";
import { ChatGptComparisonModal } from "./components/ChatGptComparisonModal";
import { OpportunityMonitorModal } from "./components/OpportunityMonitorModal";
import { ImproveProfileDrawer } from "./components/ImproveProfileDrawer";
import { AnalysisLoading } from "./components/AnalysisLoading";
import { ChatAssistantPanel } from "./components/ChatAssistantPanel";
import { analyzeBusinessProfile } from "./services/apiClient";
import { runArthaAITests, TestSuiteSummary } from "./services/testSuite";

const STORAGE_PROFILE_KEY = "artha_msme_profile_v2";

const DEFAULT_PROFILE: BusinessProfile = {
  industry: "Manufacturing",
  size: "Small",
  udyamStatus: "registered",
  udyamNumber: "UDYAM-DL-08-0048219",
  state: "Delhi",
  city: "New Delhi",
  turnoverRange: "₹5 Cr - ₹15 Cr",
  employeeCount: "35 employees",
  yearsInBusiness: "4 years",
  gstStatus: "registered",
  exportStatus: "active_exporter",
  productsServices: "Garments and apparel items",
  existingCertifications: ["ISO 9001"],
};

export function App() {
  // Navigation View: "landing" | "onboarding" | "loading" | "dashboard"
  const [currentView, setCurrentView] = useState<"landing" | "onboarding" | "loading" | "dashboard">("landing");

  // Night Mode (persistent)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem("artha_theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("artha_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("artha_theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Business Profile with Local Storage Persistence
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  const [step, setStep] = useState<number>(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [checkedPlan, setCheckedPlan] = useState<boolean[]>([false, false, false, false, false]);
  const [activeTab, setActiveTab] = useState<OpportunityCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  // Modals & Bottom Sheets
  const [showDemoSheet, setShowDemoSheet] = useState<boolean>(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MatchedOpportunity | null>(null);
  const [showSortSheet, setShowSortSheet] = useState<boolean>(false);
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);
  const [showMonitorModal, setShowMonitorModal] = useState<boolean>(false);
  const [showImproveDrawer, setShowImproveDrawer] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestSuiteSummary | null>(null);
  const [showDevMenu, setShowDevMenu] = useState<boolean>(false);
  const [showAssistantPanel, setShowAssistantPanel] = useState<boolean>(false);

  const runAnalysis = async (profToAnalyze: BusinessProfile) => {
    setCurrentView("loading");
    try {
      const result = await analyzeBusinessProfile(profToAnalyze);
      setAnalysis(result);
      setCheckedPlan(result.action_plan.map(() => false));
    } catch (err) {
      console.error("Analysis execution error:", err);
      setCurrentView("dashboard");
    }
  };

  const handleLoadingComplete = () => {
    setCurrentView("dashboard");
  };

  const handleStartOnboarding = () => {
    setStep(0);
    setCurrentView("onboarding");
  };

  const handleDemoPresetSelect = (preset: BusinessProfile) => {
    setProfile(preset);
    setShowDemoSheet(false);
    runAnalysis(preset);
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      runAnalysis(profile);
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setCurrentView("landing");
    }
  };

  const handleTogglePlanItem = (index: number) => {
    setCheckedPlan((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleRunTests = () => {
    const res = runArthaAITests();
    setTestResults(res);
    setShowTestModal(true);
  };

  // Compile all opportunities across categories
  const allOpportunities: MatchedOpportunity[] = analysis
    ? [
        ...analysis.tenders,
        ...analysis.subsidies,
        ...analysis.loans,
        ...analysis.certifications,
        ...analysis.compliance_alerts,
        ...analysis.export_opportunities,
      ]
    : [];

  const currentList = analysis
    ? activeTab === "all"
      ? allOpportunities
      : analysis[activeTab] || []
    : [];

  // Search filter
  const filtered = currentList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.document.title.toLowerCase().includes(q) ||
      item.document.description.toLowerCase().includes(q) ||
      item.document.benefits.toLowerCase().includes(q) ||
      item.document.government_department.toLowerCase().includes(q) ||
      item.document.category.toLowerCase().includes(q) ||
      item.document.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  // Sorting
  const sortedOpportunities = [...filtered].sort((a, b) => {
    if (sortBy === "priority") {
      const pMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (pMap[b.priorityLevel] || 0) - (pMap[a.priorityLevel] || 0);
    }
    if (sortBy === "newest") {
      return b.document.last_verified.localeCompare(a.document.last_verified);
    }
    if (sortBy === "deadline") {
      return a.document.deadline.localeCompare(b.document.deadline);
    }
    return b.relevanceScore - a.relevanceScore;
  });

  // Landing Page View
  if (currentView === "landing") {
    return (
      <>
        <LandingPage
          onStartOnboarding={handleStartOnboarding}
          onOpenDemoSheet={() => setShowDemoSheet(true)}
          onOpenExplainModal={() => setShowExplainModal(true)}
          onOpenMonitorModal={() => setShowMonitorModal(true)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        <DemoBottomSheet
          isOpen={showDemoSheet}
          onClose={() => setShowDemoSheet(false)}
          onSelect={handleDemoPresetSelect}
        />
        <ChatGptComparisonModal
          isOpen={showExplainModal}
          onClose={() => setShowExplainModal(false)}
        />
        <OpportunityMonitorModal
          isOpen={showMonitorModal}
          onClose={() => setShowMonitorModal(false)}
        />
      </>
    );
  }

  // Loading Screen View
  if (currentView === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
        <AnalysisLoading onComplete={handleLoadingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-150 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Top Header - Mobile First, Clean & Balanced */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <Logo
            size="sm"
            showTagline={false}
            onClick={() => setCurrentView("landing")}
            className="cursor-pointer"
          />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Secondary Tools Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDevMenu(!showDevMenu)}
                className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:flex"
              >
                <span>Tools</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showDevMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDevMenu(false);
                      handleRunTests();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Terminal className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Verify Engine Tests</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDevMenu(false);
                      setShowMonitorModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Knowledge Base Spec</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDevMenu(false);
                      setShowExplainModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Why ArthaAI?</span>
                  </button>
                </div>
              )}
            </div>

            {/* Night / Day Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {darkMode ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-slate-600" />
              )}
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => setShowAssistantPanel(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
              title="AI Assistant"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </button>

            {/* New Assessment Button */}
            <button
              onClick={() => {
                setStep(0);
                setCurrentView("onboarding");
              }}
              className="flex min-h-[36px] items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-blue-700 active:scale-98"
            >
              <RefreshCw className="h-3 w-3" />
              <span>New Assessment</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Onboarding Wizard Mode */}
        {currentView === "onboarding" ? (
          <div className="mx-auto max-w-xl py-2">
            {/* Try a demo quick link */}
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDemoSheet(true)}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Want to skip? Try a demo →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <OnboardingProgressBar step={step} />

              {step === 0 && (
                <StepIndustry
                  value={profile.industry}
                  onChange={(val) => setProfile({ ...profile, industry: val })}
                  onProfileExtracted={(extracted) => {
                    setProfile((prev) => ({ ...prev, ...extracted }));
                  }}
                />
              )}

              {step === 1 && (
                <StepSize
                  value={profile.size}
                  onChange={(val) => setProfile({ ...profile, size: val })}
                />
              )}

              {step === 2 && (
                <StepUdyam
                  value={profile.udyamStatus}
                  udyamNumber={profile.udyamNumber}
                  onChange={(val) => setProfile({ ...profile, udyamStatus: val })}
                  onUdyamNumber={(val) => setProfile({ ...profile, udyamNumber: val })}
                />
              )}

              {step === 3 && (
                <StepLocation
                  state={profile.state}
                  city={profile.city}
                  onState={(val) => setProfile({ ...profile, state: val })}
                  onCity={(val) => setProfile({ ...profile, city: val })}
                />
              )}

              {step === 4 && (
                <StepConfirmation
                  profile={profile}
                  onEditStep={(targetStep) => setStep(targetStep)}
                />
              )}

              {/* Navigation Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{step === 0 ? "Back to Home" : "Previous"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-98"
                >
                  <span>{step === 4 ? "Find My Opportunities" : "Continue"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Results Mode (Mobile-First Hierarchy) */
          <div className="space-y-5">
            {/* 1. Greeting & Compact Business Summary (~70-90px) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Your Business
                  </span>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <h1 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                      {profile.size} • {profile.industry} • {profile.city ? `${profile.city}, ` : ""}{profile.state}
                    </h1>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                        profile.udyamStatus === "registered"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {profile.udyamStatus === "registered" ? "Udyam: Registered (user-provided)" : "Udyam: Pending"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImproveDrawer(true)}
                    className="flex min-h-[34px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <SlidersHorizontal className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span>Improve Matching</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                      setCurrentView("onboarding");
                    }}
                    className="flex min-h-[34px] items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. TOP 3 ACTIONS — MAIN FEATURE (Section 19) */}
            {analysis && analysis.action_plan.length > 0 && (
              <ActionPlanSection
                steps={analysis.action_plan}
                top3Actions={analysis.top3Actions}
                checked={checkedPlan}
                onToggle={handleTogglePlanItem}
                onOpenOpportunity={(oppId) => {
                  const found = allOpportunities.find((o) => o.document.id === oppId);
                  if (found) setSelectedOpportunity(found);
                }}
              />
            )}

            {/* 3. Executive Intelligence Summary */}
            {analysis && (
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 p-4 shadow-2xs dark:border-blue-950 dark:from-blue-950/40 dark:to-slate-900 sm:p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 dark:text-blue-200">
                    Executive Opportunity Intelligence
                  </h2>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200 sm:text-sm">
                  {analysis.summary}
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{analysis.sourceAttribution}</span>
                </div>
              </div>
            )}

            {/* 4. Relevant Opportunities Feed (Section 20 & 21) */}
            <div className="space-y-3.5">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    Relevant Opportunities ({sortedOpportunities.length})
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Search toggle */}
                  {showSearchInput ? (
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search schemes..."
                        autoFocus
                        className="min-h-[34px] w-48 rounded-xl border border-slate-200 bg-white py-1 pl-7 pr-3 text-xs text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSearchInput(true)}
                      className="flex min-h-[34px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    >
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                      <span>Search</span>
                    </button>
                  )}

                  {/* Sort button (opens bottom sheet) */}
                  <button
                    type="button"
                    onClick={() => setShowSortSheet(true)}
                    className="flex min-h-[34px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    <span>Sort</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Category Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: "all", label: "All", count: allOpportunities.length, icon: Layers },
                  { id: "subsidies", label: "Subsidies", count: analysis?.subsidies.length || 0, icon: IndianRupee },
                  { id: "loans", label: "Financing", count: analysis?.loans.length || 0, icon: FileCheck2 },
                  { id: "tenders", label: "Tenders & GeM", count: analysis?.tenders.length || 0, icon: Building2 },
                  { id: "certifications", label: "Certifications", count: analysis?.certifications.length || 0, icon: Award },
                  { id: "compliance_alerts", label: "Payment Protection", count: analysis?.compliance_alerts.length || 0, icon: AlertTriangle },
                  { id: "export_opportunities", label: "Exports", count: analysis?.export_opportunities.length || 0, icon: Globe },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          isActive
                            ? "bg-blue-700 text-blue-100"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Opportunities Grid & Empty States */}
              {sortedOpportunities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                  <AlertCircle className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                    No highly relevant verified opportunities found.
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Add more business details in the profile drawer to improve matching.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      onClick={() => setShowImproveDrawer(true)}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-blue-700"
                    >
                      Improve My Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("all");
                        setSearchQuery("");
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {sortedOpportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.document.id}
                      opportunity={opp}
                      onOpenDetails={(o) => setSelectedOpportunity(o)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 5. Trust Center (Collapsible at bottom) */}
            <TrustCenterSection />
          </div>
        )}
      </main>

      {/* Modals & Slide-in Drawers */}
      <DemoBottomSheet
        isOpen={showDemoSheet}
        onClose={() => setShowDemoSheet(false)}
        onSelect={handleDemoPresetSelect}
      />

      <WhyMatchedBottomSheet
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />

      <SortBottomSheet
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        currentSort={sortBy}
        onSelect={(s) => setSortBy(s)}
      />

      <ChatGptComparisonModal
        isOpen={showExplainModal}
        onClose={() => setShowExplainModal(false)}
      />

      <OpportunityMonitorModal
        isOpen={showMonitorModal}
        onClose={() => setShowMonitorModal(false)}
      />

      <ImproveProfileDrawer
        isOpen={showImproveDrawer}
        onClose={() => setShowImproveDrawer(false)}
        profile={profile}
        onSave={(updated) => {
          setProfile(updated);
          runAnalysis(updated);
        }}
      />

      {/* Automated In-App Test Suite Modal */}
      {showTestModal && testResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <button
              onClick={() => setShowTestModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                Automated Engine Verification Suite
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Evaluates normalization, multi-factor scoring, test scenarios A-I, knowledge base schema integrity, and official URL validity.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {testResults.passed} of {testResults.total} Tests Passed
              </span>
              {testResults.failed === 0 ? (
                <span className="text-xs font-semibold text-emerald-600">All tests passing green ✓</span>
              ) : (
                <span className="text-xs font-semibold text-rose-600">{testResults.failed} tests failed</span>
              )}
            </div>

            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 text-xs dark:divide-slate-800 dark:border-slate-800">
              {testResults.results.map((t, idx) => (
                <div key={idx} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase ${
                        t.passed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {t.passed ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{t.details}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowTestModal(false)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-blue-700"
              >
                Close Results
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI Assistant Panel */}
      <ChatAssistantPanel
        isOpen={showAssistantPanel}
        onClose={() => setShowAssistantPanel(false)}
        businessProfile={profile}
      />
    </div>
  );
}
export default App;
