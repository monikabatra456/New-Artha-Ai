import { BusinessProfile, AnalysisResult } from "../types";
import { generateRAGAnalysis } from "./ragEngine";

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

export interface DocumentExtractionResult {
  udyamNumber?: string | null;
  businessName?: string | null;
  industryCategory?: string | null;
  enterpriseSize?: string | null;
  state?: string | null;
  city?: string | null;
  registrationDate?: string | null;
  gstNumber?: string | null;
  documentType?: "udyam_certificate" | "gst_certificate" | "unknown";
}

export async function analyzeBusinessProfile(profile: BusinessProfile): Promise<AnalysisResult> {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });

    if (res.ok) {
      const data: AnalysisResult = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("Backend API request failed, falling back to client-side RAG engine:", err);
  }

  // Fallback to verified local RAG engine (zero dependency, guaranteed pitch demo reliability)
  return generateRAGAnalysis(profile);
}

export async function getAssistantAvailability(): Promise<{ available: boolean }> {
  try {
    const res = await fetch("/api/health");
    return { available: res.ok };
  } catch {
    return { available: false };
  }
}

export async function sendAssistantChat(
  message: string,
  conversationHistory: ChatMessage[],
  businessProfile?: BusinessProfile
): Promise<{ response?: string; error?: string; code?: string }> {
  try {
    const res = await fetch("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversationHistory, businessProfile }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { response: data.response };
    }
    if (res.status === 429 || data.code === "RATE_LIMIT") {
      return {
        error: "AI assistant is temporarily busy, try again in a moment",
        code: "RATE_LIMIT",
      };
    }
    if (res.status === 503 || data.code === "AI_UNAVAILABLE") {
      return {
        error: "AI assistant unavailable",
        code: "AI_UNAVAILABLE",
      };
    }
    return { error: data.error || "Failed to get AI assistant response.", code: data.code };
  } catch {
    return { error: "Network error connecting to AI assistant.", code: "NETWORK_ERROR" };
  }
}

export async function extractDocumentData(
  file: File
): Promise<{ success: boolean; extractedData?: DocumentExtractionResult; error?: string; code?: string }> {
  try {
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 5MB limit." };
    }

    const formData = new FormData();
    formData.append("document", file);

    const res = await fetch("/api/documents/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return { success: true, extractedData: data.extractedData };
    }
    if (res.status === 429 || data.code === "RATE_LIMIT") {
      return {
        success: false,
        error: "AI assistant is temporarily busy, try again in a moment",
        code: "RATE_LIMIT",
      };
    }
    if (res.status === 503 || data.code === "AI_UNAVAILABLE") {
      return {
        success: false,
        error: "Document extraction is unavailable. Please enter details manually.",
        code: "AI_UNAVAILABLE",
      };
    }
    return {
      success: false,
      error: data.error || "Couldn't read this document, please enter details manually.",
      code: data.code,
    };
  } catch {
    return {
      success: false,
      error: "Couldn't read this document, please enter details manually.",
    };
  }
}

