import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { BusinessProfile } from "../types";
import { VoiceInputButton } from "./VoiceInputButton";
import { DocumentUploadSection } from "./DocumentUploadSection";

export const INDUSTRIES = [
  { label: "Manufacturing", desc: "Factories, production & physical goods" },
  { label: "Services", desc: "Consulting, engineering, logistics & B2B services" },
  { label: "Retail & Wholesale", desc: "Shops, distributors & trading businesses" },
  { label: "Food Processing", desc: "Agro-food, packaged goods & beverages" },
  { label: "Textiles & Apparel", desc: "Garments, spinning, weaving & fabrics" },
  { label: "IT / Software", desc: "Tech products, software services & digital" },
  { label: "Handicrafts & Artisans", desc: "Traditional crafts, art & handlooms" },
  { label: "Export / Trading", desc: "Cross-border merchandise & commodities" },
  { label: "Agriculture & Allied", desc: "Farming, dairy, poultry & storage" },
  { label: "Construction & Infra", desc: "Civil works, building materials & contracting" },
];

export const SIZES = [
  { key: "Micro", label: "Micro Enterprise", helper: "Investment ≤ ₹1 Cr · Annual Turnover ≤ ₹5 Cr" },
  { key: "Small", label: "Small Enterprise", helper: "Investment ≤ ₹10 Cr · Annual Turnover ≤ ₹50 Cr" },
  { key: "Medium", label: "Medium Enterprise", helper: "Investment ≤ ₹50 Cr · Annual Turnover ≤ ₹250 Cr" },
];

export const UDYAM_OPTIONS = [
  { key: "registered", label: "Yes, Udyam registered", helper: "I have a valid Udyam registration number" },
  { key: "not_registered", label: "Not yet registered", helper: "I haven't registered or need help applying" },
  { key: "not_sure", label: "Not sure / In progress", helper: "Old UAM or application pending" },
];

export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Chandigarh", "Puducherry",
];

export function OnboardingProgressBar({ step }: { step: number }) {
  const currentDisplay = step < 4 ? `0${step + 1} / 04` : "Ready";

  return (
    <div className="mb-6" id="onboarding-progress-bar">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>{step < 4 ? `Step ${step + 1} of 4` : "Final Check"}</span>
        <span className="font-mono text-blue-600 dark:text-blue-400">{currentDisplay}</span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  helper?: string;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  selected,
  onClick,
  title,
  helper,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[50px] w-full rounded-xl border-2 p-3.5 text-left transition active:scale-[0.99] ${
        selected
          ? "border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
        {selected && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </span>
        )}
      </div>
      {helper && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p>}
    </button>
  );
};

export function StepIndustry({
  value,
  onChange,
  onProfileExtracted,
}: {
  value: string;
  onChange: (val: string) => void;
  onProfileExtracted?: (extractedProfile: Partial<BusinessProfile>) => void;
}) {
  const [custom, setCustom] = useState("");
  return (
    <div className="space-y-6">
      {onProfileExtracted && (
        <DocumentUploadSection onProfileExtracted={onProfileExtracted} />
      )}

      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
          What does your business do?
        </h2>
        <p className="mt-1 mb-5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          This helps us find opportunities relevant to your business.
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {INDUSTRIES.map((ind) => (
            <OptionCard
              key={ind.label}
              title={ind.label}
              helper={ind.desc}
              selected={value === ind.label}
              onClick={() => onChange(ind.label)}
            />
          ))}
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Or enter a specific sector
          </label>
          <div className="flex items-center gap-2">
            <input
              id="custom-industry-input"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                onChange(e.target.value);
              }}
              placeholder="e.g. Solar Inverters, Leather Footwear, Precision Machining"
              className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <VoiceInputButton
              onTranscript={(text) => {
                const newVal = custom ? `${custom} ${text}` : text;
                setCustom(newVal);
                onChange(newVal);
              }}
              title="Speak industry/sector"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepSize({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: any) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
        How big is your business?
      </h2>
      <p className="mt-1 mb-5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        Official MSME thresholds determine your subsidy tier and tender quotas.
      </p>

      <div className="space-y-3">
        {SIZES.map((s) => (
          <OptionCard
            key={s.key}
            title={s.label}
            helper={s.helper}
            selected={value === s.key}
            onClick={() => onChange(s.key)}
          />
        ))}
      </div>
    </div>
  );
}

export function StepUdyam({
  value,
  udyamNumber,
  onChange,
  onUdyamNumber,
}: {
  value: string;
  udyamNumber?: string;
  onChange: (val: any) => void;
  onUdyamNumber: (val: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
        Is your business Udyam registered?
      </h2>
      <p className="mt-1 mb-5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        Udyam registration unlocks GeM tender bidding and collateral-free loan quotas.
      </p>

      <div className="space-y-3">
        {UDYAM_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.key}
            title={opt.label}
            helper={opt.helper}
            selected={value === opt.key}
            onClick={() => onChange(opt.key)}
          />
        ))}
      </div>

      {value === "registered" && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Udyam Registration Number (optional)
          </label>
          <div className="flex items-center gap-2">
            <input
              id="udyam-number-input"
              value={udyamNumber || ""}
              onChange={(e) => onUdyamNumber(e.target.value.toUpperCase())}
              placeholder="e.g. UDYAM-DL-01-0012345"
              className="min-h-[44px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <VoiceInputButton
              onTranscript={(text) => {
                const clean = text.replace(/\s+/g, "").toUpperCase();
                onUdyamNumber(clean);
              }}
              title="Speak Udyam number"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Registration number provided by user.
          </p>
        </div>
      )}
    </div>
  );
}

export function StepLocation({
  state,
  city,
  onState,
  onCity,
}: {
  state: string;
  city?: string;
  onState: (s: string) => void;
  onCity: (c: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
        Where is your business based?
      </h2>
      <p className="mt-1 mb-5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        State jurisdiction unlocks local subsidies and industrial cluster benefits.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            State / Union Territory
          </label>
          <select
            id="state-select"
            value={state}
            onChange={(e) => onState(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="">Select state or UT</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            City / Industrial Estate (optional)
          </label>
          <div className="flex items-center gap-2">
            <input
              id="city-input"
              value={city || ""}
              onChange={(e) => onCity(e.target.value)}
              placeholder="e.g. Ludhiana, Coimbatore, Okhla New Delhi, Surat"
              className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <VoiceInputButton
              onTranscript={(text) => {
                onCity(city ? `${city} ${text}` : text);
              }}
              title="Speak city or industrial area"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepConfirmation({
  profile,
  onEditStep,
}: {
  profile: BusinessProfile;
  onEditStep: (step: number) => void;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
        <Sparkles className="h-3.5 w-3.5" />
        <span>You're all set.</span>
      </div>

      <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
        Ready to find what your business can act on?
      </h2>
      <p className="mt-1 mb-5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        We'll match your business against the verified MSME knowledge base.
      </p>

      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400">Industry</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{profile.industry}</p>
          </div>
          <button
            onClick={() => onEditStep(0)}
            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400">Business Size</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{profile.size} Enterprise</p>
          </div>
          <button
            onClick={() => onEditStep(1)}
            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400">Udyam Status</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {profile.udyamStatus === "registered"
                ? "Registered (user-provided)"
                : profile.udyamStatus === "not_registered"
                ? "Not yet registered"
                : "In progress"}
            </p>
          </div>
          <button
            onClick={() => onEditStep(2)}
            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Location</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {profile.city ? `${profile.city}, ` : ""}{profile.state}
            </p>
          </div>
          <button
            onClick={() => onEditStep(3)}
            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
