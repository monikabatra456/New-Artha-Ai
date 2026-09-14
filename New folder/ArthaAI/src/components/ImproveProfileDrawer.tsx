import React, { useState } from "react";
import { X, Sparkles, SlidersHorizontal } from "lucide-react";
import { BusinessProfile } from "../types";
import { VoiceInputButton } from "./VoiceInputButton";

interface ImproveProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  onSave: (updatedProfile: BusinessProfile) => void;
}

export const ImproveProfileDrawer: React.FC<ImproveProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>({
    ...profile,
    turnoverRange: profile.turnoverRange || "₹1 Cr - ₹5 Cr",
    employeeCount: profile.employeeCount || "10 - 25",
    yearsInBusiness: profile.yearsInBusiness || "2 - 5 years",
    gstStatus: profile.gstStatus || "registered",
    exportStatus: profile.exportStatus || "domestic_only",
    productsServices: profile.productsServices || "",
    existingCertifications: profile.existingCertifications || [],
  });

  if (!isOpen) return null;

  const TURNOVER_OPTIONS = [
    "< ₹40 Lakh",
    "₹40 Lakh - ₹1.5 Cr",
    "₹1.5 Cr - ₹5 Cr",
    "₹5 Cr - ₹25 Cr",
    "₹25 Cr - ₹50 Cr",
    "> ₹50 Cr",
  ];

  const EMPLOYEE_OPTIONS = ["1 - 5", "5 - 20", "20 - 50", "50 - 150", "150+"];
  const YEARS_OPTIONS = ["< 1 year (New / Startup)", "1 - 3 years", "3 - 7 years", "7+ years"];
  const CERT_OPTIONS = [
    "ISO 9001",
    "ISO 14001",
    "FSSAI Food Safety",
    "BIS Hallmark",
    "ZED Bronze/Silver",
    "CE Marking",
    "None Yet",
  ];

  const toggleCert = (cert: string) => {
    setFormData((prev) => {
      const current = prev.existingCertifications || [];
      if (cert === "None Yet") {
        return { ...prev, existingCertifications: [] };
      }
      const filtered = current.filter((c) => c !== "None Yet");
      if (filtered.includes(cert)) {
        return { ...prev, existingCertifications: filtered.filter((c) => c !== cert) };
      } else {
        return { ...prev, existingCertifications: [...filtered, cert] };
      }
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Improve Recommendations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-4.5 overflow-y-auto p-5 text-xs text-slate-700 dark:text-slate-300">
          <p className="text-slate-500 dark:text-slate-400">
            Adding these optional business attributes helps ArthaAI calibrate exact subsidy ceilings, credit guarantee ratios, and export duty remissions.
          </p>

          {/* Turnover */}
          <div>
            <label className="mb-1.5 block font-bold text-slate-900 dark:text-white">
              Annual Turnover Range
            </label>
            <select
              value={formData.turnoverRange}
              onChange={(e) => setFormData({ ...formData, turnoverRange: e.target.value })}
              className="min-h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              {TURNOVER_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Employees */}
          <div>
            <label className="mb-1.5 block font-bold text-slate-900 dark:text-white">
              Total Workforce / Employees
            </label>
            <select
              value={formData.employeeCount}
              onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
              className="min-h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              {EMPLOYEE_OPTIONS.map((e) => (
                <option key={e} value={e}>{e} employees</option>
              ))}
            </select>
          </div>

          {/* Years in Business */}
          <div>
            <label className="mb-1.5 block font-bold text-slate-900 dark:text-white">
              Years in Business
            </label>
            <select
              value={formData.yearsInBusiness}
              onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
              className="min-h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              {YEARS_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* GST Status */}
          <div>
            <label className="mb-1.5 block font-bold text-slate-900 dark:text-white">
              GST Registration Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "registered", label: "Regular GST" },
                { key: "composition", label: "Composition" },
                { key: "unregistered", label: "Exempt / None" },
              ].map((gst) => (
                <button
                  key={gst.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, gstStatus: gst.key as any })}
                  className={`min-h-[38px] rounded-xl border px-2 py-2 text-center text-xs font-semibold transition ${
                    formData.gstStatus === gst.key
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                  }`}
                >
                  {gst.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export Status */}
          <div>
            <label className="mb-1.5 block font-bold text-slate-900 dark:text-white">
              Export Readiness
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "active_exporter", label: "Active Exporter" },
                { key: "interested", label: "Planning to Export" },
                { key: "domestic_only", label: "Domestic Only" },
              ].map((exp) => (
                <button
                  key={exp.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, exportStatus: exp.key as any })}
                  className={`min-h-[38px] rounded-xl border px-2 py-2 text-center text-xs font-semibold transition ${
                    formData.exportStatus === exp.key
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Products / Services */}
          <div>
            <label className="mb-1.5 block font-bold text-slate-900 dark:text-white">
              Key Products or Services
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.productsServices || ""}
                onChange={(e) => setFormData({ ...formData, productsServices: e.target.value })}
                placeholder="e.g. Cotton shirts, Brass handicrafts, Cloud software"
                className="min-h-[40px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
              <VoiceInputButton
                onTranscript={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    productsServices: prev.productsServices ? `${prev.productsServices} ${text}` : text,
                  }));
                }}
                title="Speak products or services"
              />
            </div>
          </div>

          {/* Existing Certifications */}
          <div>
            <label className="mb-1.5 block font-bold text-slate-900 dark:text-white">
              Existing Certifications
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CERT_OPTIONS.map((c) => {
                const isSelected = (formData.existingCertifications || []).includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCert(c)}
                    className={`min-h-[32px] rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            onClick={handleSave}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Update & Re-rank Opportunities</span>
          </button>
        </div>
      </div>
    </div>
  );
};
