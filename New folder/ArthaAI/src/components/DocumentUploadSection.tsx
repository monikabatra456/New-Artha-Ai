import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  Building,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { BusinessProfile } from "../types";
import { extractDocumentData, DocumentExtractionResult } from "../services/apiClient";

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
      partialProf.industry = extractedResult.industryCategory;
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
      className={`bg-gradient-to-br from-emerald-950/10 via-teal-900/10 to-slate-900/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/20 rounded-2xl p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Auto-fill via Udyam / GST Document
              <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                Gemini Vision AI
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload certificate to extract Udyam, size, state, and category automatically
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
          className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 bg-white/60 dark:bg-slate-900/60 rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/50 dark:hover:bg-slate-800/50 group"
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
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop certificate
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports Udyam Certificate or GSTIN document (PDF, JPG, PNG up to 5MB)
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            🔒 Processed in-memory and discarded. Zero storage.
          </p>
        </div>
      )}

      {/* Uploading Loading State */}
      {isUploading && (
        <div className="bg-white/80 dark:bg-slate-900/80 border border-emerald-500/30 rounded-xl p-6 text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Reading certificate via Gemini Multimodal Vision AI...
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
