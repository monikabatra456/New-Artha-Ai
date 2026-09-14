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

    const data = await res.json();
    if (res.ok) {
      return { response: data.response };
    } else {
      return { error: data.error || "Failed to get AI assistant response.", code: data.code };
    }
  } catch (err: any) {
    return { error: "Network error connecting to AI assistant.", code: "NETWORK_ERROR" };
  }
}

export async function extractDocumentData(
  file: File
): Promise<{ success: boolean; extractedData?: DocumentExtractionResult; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("document", file);

    const res = await fetch("/api/documents/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, extractedData: data.extractedData };
    } else {
      return {
        success: false,
        error: data.error || "Couldn't read this document, please enter details manually.",
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: "Couldn't read this document, please enter details manually.",
    };
  }
}

