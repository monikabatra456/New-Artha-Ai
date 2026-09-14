import React, { useState, useRef } from "react";
import {
  Upload,
  AlertCircle,
  Loader2,
  FileCheck,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { BusinessProfile } from "../types";
import { extractDocumentData, DocumentExtractionResult } from "../services/apiClient";

const INDUSTRY_LABEL_MAP: Record<string, string> = {
  Manufacturing: "Manufacturing",
  Retail: "Retail & Wholesale",
  Services: "Services",
  "Export / Trading": "Export / Trading",
  "Food Processing": "Food Processing",
  Textiles: "Textiles & Apparel",
  "IT / Software": "IT / Software",
  Agriculture: "Agriculture & Allied",
  Construction: "Construction & Infra",
  Handicrafts: "Handicrafts & Artisans",
};

function mapExtractedIndustry(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (INDUSTRY_LABEL_MAP[trimmed]) return INDUSTRY_LABEL_MAP[trimmed];
  const lower = trimmed.toLowerCase();
  const hit = Object.entries(INDUSTRY_LABEL_MAP).find(
    ([key, label]) => key.toLowerCase() === lower || label.toLowerCase() === lower
  );
  return hit ? hit[1] : trimmed;
}

interface DocumentUploadSectionProps {
  onProfileExtracted: (extractedProfile: Partial<BusinessProfile>) => void;
  className?: string;
}

export function DocumentUploadSection({
  onProfileExtracted,
  className = "",
}: DocumentUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<DocumentExtractionResult | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setErrorMsg(null);
    setIsApplied(false);

    // Validation
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    const isAllowedExt = ["pdf", "jpg", "jpeg", "png", "webp"].includes(ext || "");

    if (!allowedTypes.includes(selectedFile.type) && !isAllowedExt) {
      setErrorMsg("Unsupported file type. Please upload a PDF or JPG/PNG image.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit.");
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

    const result = await extractDocumentData(selectedFile);
    setIsUploading(false);

    if (result.success && result.extractedData) {
      setExtractedResult(result.extractedData);
    } else {
      setErrorMsg(result.error || "Couldn't read this document, please enter details manually.");
      setFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleApplyFields = () => {
    if (!extractedResult) return;

    const partialProf: Partial<BusinessProfile> = {};

    if (extractedResult.udyamNumber) {
      partialProf.udyamNumber = extractedResult.udyamNumber;
      partialProf.udyamStatus = "registered";
    }

    if (extractedResult.enterpriseSize && ["Micro", "Small", "Medium"].includes(extractedResult.enterpriseSize)) {
      partialProf.size = extractedResult.enterpriseSize as any;
    }

    if (extractedResult.industryCategory) {
      const mapped = mapExtractedIndustry(extractedResult.industryCategory);
      if (mapped) partialProf.industry = mapped;
    }

    if (extractedResult.state) {
      partialProf.state = extractedResult.state;
    }

    if (extractedResult.city) {
      partialProf.city = extractedResult.city;
    }

    if (extractedResult.gstNumber) {
      partialProf.gstStatus = "registered";
    }

    if (extractedResult.businessName) {
      partialProf.productsServices = extractedResult.businessName;
    }

    onProfileExtracted(partialProf);
    setIsApplied(true);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedResult(null);
    setErrorMsg(null);
    setIsApplied(false);
  };

  return (
    <div
      className={`rounded-2xl border border-sky-200 bg-[#e8f2ff] p-5 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="rounded-xl bg-[#12233a] p-2 text-white dark:bg-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Have an Udyam or GST certificate?
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-800 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800">
                Auto-fill
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload the certificate. We’ll read the number, size and state — you check before matching.
            </p>
          </div>
        </div>

        {extractedResult && (
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Reset File
          </button>
        )}
      </div>

      {/* Upload Zone */}
      {!extractedResult && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-800/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform group-hover:scale-105 dark:bg-slate-800 dark:text-slate-300">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop certificate
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports Udyam Certificate or GSTIN document (PDF, JPG, PNG up to 5MB)
          </p>
          <p className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Processed in memory and discarded. Nothing is stored.
          </p>
        </div>
      )}

      {/* Uploading Loading State */}
      {isUploading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900/80">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Reading certificate…
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyzing {file?.name}
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Extracted Preview & Pre-fill Action */}
      {extractedResult && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Extracted Attributes ({extractedResult.documentType || "Certificate"})
              </span>
            </div>
            {isApplied && (
              <span className="text-xs bg-emerald-500 text-white font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Pre-filled into Form
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                Udyam Number
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {extractedResult.udyamNumber || "Not detected"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                Enterprise Name
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {extractedResult.businessName || "Not detected"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                Enterprise Size
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {extractedResult.enterpriseSize || "Not detected"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                Industry Sector
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {extractedResult.industryCategory || "Not detected"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                State
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {extractedResult.state || "Not detected"}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                GSTIN / Registration
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {extractedResult.gstNumber || extractedResult.registrationDate || "Not detected"}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Review fields below before running match calculation.
            </p>
            <button
              type="button"
              onClick={handleApplyFields}
              disabled={isApplied}
              className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                isApplied
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Profile Updated
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Apply to Form
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
