import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile } from "./src/types";
import { generateRAGAnalysis, normalizeProfile } from "./src/services/ragEngine";
import { MSME_KNOWLEDGE_BASE } from "./src/data/msmeKnowledgeBase";
import { validateKnowledgeBase } from "./src/utils/knowledgeBaseValidator";

dotenv.config();

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  storage: multer.memoryStorage(),
});

// Startup Knowledge Base Audit
const kbValidation = validateKnowledgeBase(MSME_KNOWLEDGE_BASE);
console.log(
  `[ArthaAI Sovereign KB] Loaded ${kbValidation.totalRecords} records. Status: ${kbValidation.status} (${kbValidation.validCount} valid, ${kbValidation.warningCount} warnings).`
);

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
      aiClient = null;
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  // Dynamic port binding for Render / container deployments
  const PORT = Number(process.env.PORT) || 3000;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  app.use(express.json());

  // 1. Health check & Observability
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "ArthaAI",
      version: "1.0.0",
      knowledgeBaseRecords: MSME_KNOWLEDGE_BASE.length,
      knowledgeBaseStatus: kbValidation.status,
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
      model: Boolean(process.env.GEMINI_API_KEY) ? GEMINI_MODEL : "deterministic-rag-fallback",
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Knowledge Base retrieval endpoint
  app.get("/api/schemes", (_req, res) => {
    res.json({
      total: MSME_KNOWLEDGE_BASE.length,
      schemes: MSME_KNOWLEDGE_BASE,
      lastIngested: "August 2026",
      sourceCount: 48,
    });
  });

  // 3. Opportunity Monitor Architecture Spec
  app.get("/api/monitor/status", (_req, res) => {
    res.json({
      architecture: "Continuous Ingestion Pipeline (Prototype Seed Stage)",
      totalPortalsIndexed: 48,
      status: "Verified Knowledge Base Active",
      monitoredSources: [
        {
          portal: "Government e-Marketplace (GeM)",
          scope: "Mandatory 25% MSME Quotas & EMD Waivers",
          status: "Verified Knowledge Base",
        },
        {
          portal: "Udyam & MSME SAMADHAAN",
          scope: "Section 43B(h) & Payment Dispute Resolution",
          status: "Verified Knowledge Base",
        },
        {
          portal: "Central Public Procurement Portal (CPPP)",
          scope: "Central Ministry & PSU Tenders",
          status: "Verified Knowledge Base",
        },
        {
          portal: "DGFT & Foreign Trade Policy 2023-28",
          scope: "RoDTEP, Duty Drawbacks & Trade Fairs",
          status: "Verified Knowledge Base",
        },
        {
          portal: "Ministry of MSME & SIDBI Portal",
          scope: "CGTMSE Collateral-Free Loans & PMEGP",
          status: "Verified Knowledge Base",
        },
      ],
      plannedIngestion: [
        "Live GeM Tender WebSocket Feeds",
        "E-Gazette Daily Scraping Cron Workers",
        "State Industrial Policy Real-Time Webhooks",
        "Proactive WhatsApp / SMS Deadline Alerts",
      ],
    });
  });

  // 4. Main RAG Pipeline Endpoint: Profile -> Retrieval -> Evidence Grounding -> Explanation
  app.post("/api/analyze", async (req, res) => {
    try {
      const profile: BusinessProfile = req.body.profile;
      if (!profile || !profile.industry || !profile.size || !profile.state) {
        res.status(400).json({ error: "Incomplete business profile provided." });
        return;
      }

      console.log(
        `[RAG Analysis] Evaluating for ${profile.size} ${profile.industry} enterprise in ${profile.state} (Udyam: ${profile.udyamStatus})`
      );

      // Step 1: Normalization & Verified Deterministic RAG Retrieval
      const normProf = normalizeProfile(profile);
      const ragAnalysis = generateRAGAnalysis(normProf);

      // Step 2: Grounded LLM Explanation Layer (using Gemini Server-Side if key available)
      const ai = getAiClient();
      if (ai) {
        try {
          const retrievedContext = JSON.stringify({
            profile: normProf,
            topTenders: ragAnalysis.tenders.slice(0, 3).map((t) => ({
              title: t.document.title,
              dept: t.document.government_department,
              benefits: t.document.benefits,
              url: t.document.application_url,
            })),
            topSubsidies: ragAnalysis.subsidies.slice(0, 3).map((s) => ({
              title: s.document.title,
              benefits: s.document.benefits,
              url: s.document.application_url,
            })),
            topLoans: ragAnalysis.loans.slice(0, 3).map((l) => ({
              title: l.document.title,
              benefits: l.document.benefits,
              url: l.document.application_url,
            })),
            topCerts: ragAnalysis.certifications.slice(0, 3).map((c) => ({
              title: c.document.title,
              benefits: c.document.benefits,
              url: c.document.application_url,
            })),
            topCompliance: ragAnalysis.compliance_alerts.slice(0, 3).map((c) => ({
              title: c.document.title,
              description: c.document.description,
            })),
          });

          const prompt = `You are ArthaAI's Executive MSME Opportunity Intelligence Synthesizer.
Strict Grounding Constraint: You may ONLY make factual claims supported by the supplied retrieved evidence.
Do NOT invent scheme names, fake percentages, or arbitrary deadlines.

Retrieved Evidence:
${retrievedContext}

Provide a concise, highly specific executive summary (1-2 sentences) explaining why this specific ${normProf.size} ${normProf.industry} enterprise in ${normProf.state} qualifies for these exact retrieved schemes and the immediate commercial impact.

Respond with ONLY valid JSON:
{
  "executive_summary": "one or two punchy sentences summarizing specific commercial benefits from the retrieved schemes"
}`;

          const geminiResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  executive_summary: {
                    type: Type.STRING,
                    description: "Executive summary tailored strictly to the retrieved schemes",
                  },
                },
                required: ["executive_summary"],
              },
            },
          });

          if (geminiResponse.text) {
            const parsed = JSON.parse(geminiResponse.text);
            if (parsed.executive_summary) {
              ragAnalysis.summary = parsed.executive_summary;
              ragAnalysis.generatedVia = "rag_llm_grounded";
            }
          }
        } catch (llmErr) {
          console.warn("LLM explanation enrichment skipped (fallback to verified RAG engine):", llmErr);
        }
      }

      res.json(ragAnalysis);
    } catch (err: any) {
      console.error("Error in /api/analyze:", err);
      res.status(500).json({
        error: "Failed to generate MSME opportunity analysis.",
        details: err?.message || "Internal server error",
      });
    }
  });

  // 5. Conversational AI Assistant Endpoint (Grounded in Sovereign KB & Profile)
  app.post("/api/assistant/chat", async (req, res) => {
    try {
      const { message, conversationHistory, businessProfile } = req.body;
      if (!message || typeof message !== "string" || !message.trim()) {
        res.status(400).json({ error: "Message string is required." });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(503).json({
          error: "AI assistant is currently unavailable. GEMINI_API_KEY is not configured.",
          code: "AI_UNAVAILABLE",
        });
        return;
      }

      const normProf = businessProfile ? normalizeProfile(businessProfile) : undefined;
      const relevantSchemes = MSME_KNOWLEDGE_BASE.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        department: doc.government_department,
        eligibility: doc.eligibility,
        benefits: doc.benefits,
        required_documents: doc.required_documents,
        official_source: doc.official_source,
        deadline: doc.deadline,
      }));

      const historyPrompt = (conversationHistory || [])
        .map((h: any) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`)
        .join("\n");

      const prompt = `You are ArthaAI's MSME Opportunities Assistant, an expert advisor for Indian Small & Medium Enterprises.

STRICT GROUNDING CONSTRAINTS:
1. Answer ONLY using the user's Business Profile (if provided) and the app's official Knowledge Base of MSME schemes provided below.
2. You MUST NOT invent scheme names, fake eligibility rules, arbitrary deadlines, or unverified subsidy percentages.
3. If the answer is not present in our database or cannot be confirmed from the context, explicitly state: "I don't have verified details for that specific scheme in our current database. Please check the Matched Opportunities list or official government portals."

User Business Profile:
${normProf ? JSON.stringify(normProf) : "Not provided"}

MSME Scheme Knowledge Base Context (Verified Government Schemes):
${JSON.stringify(relevantSchemes.slice(0, 15))}

Conversation History:
${historyPrompt}

Current User Question: ${message.trim()}

Respond in clear, concise, practical natural language for an Indian MSME owner. Use bullet points where appropriate.`;

      const geminiResponse = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const replyText = geminiResponse.text || "I apologize, but I was unable to generate a response at this moment.";
      res.json({ response: replyText });
    } catch (err: any) {
      console.error("Error in /api/assistant/chat:", err);
      if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("Quota")) {
        res.status(429).json({
          error: "AI assistant is temporarily busy, try again in a moment",
          code: "RATE_LIMIT",
        });
      } else {
        res.status(500).json({
          error: "AI assistant service encountered an error.",
          details: err?.message || "Internal server error",
        });
      }
    }
  });

  // 6. Multimodal Document Data Extraction Endpoint (Udyam / GST Certificate)
  app.post("/api/documents/extract", upload.single("document"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded. Please select a PDF or image document." });
        return;
      }

      const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        res.status(400).json({ error: "Unsupported file type. Please upload a PDF or JPG/PNG image." });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        res.status(400).json({ error: "File size exceeds 5MB limit." });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(503).json({
          error: "Document AI extraction unavailable. GEMINI_API_KEY is not configured.",
          code: "AI_UNAVAILABLE",
        });
        return;
      }

      const extractionPrompt = `Analyze this Indian MSME business document (Udyam Registration Certificate or GST Certificate).
Extract key business attributes into structured JSON.
CRITICAL CONSTRAINT: Fields that CANNOT be clearly and confidently read from the document MUST be set to null. Do NOT guess or invent numbers/dates.

Return ONLY valid JSON matching this schema:
{
  "udyamNumber": "UDYAM registration number if present (e.g. UDYAM-XX-00-0000000) or null",
  "businessName": "Official name of the enterprise or null",
  "industryCategory": "One of: Manufacturing | Retail | Services | Export / Trading | Food Processing | Textiles | IT / Software | Agriculture | Construction | Handicrafts or null",
  "enterpriseSize": "One of: Micro | Small | Medium or null",
  "state": "Indian State name or null",
  "city": "City/District name or null",
  "registrationDate": "Registration date string or null",
  "gstNumber": "GSTIN number if present or null",
  "documentType": "udyam_certificate | gst_certificate | unknown"
}`;

      const geminiResponse = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: file.mimetype,
                  data: file.buffer.toString("base64"),
                },
              },
              {
                text: extractionPrompt,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              udyamNumber: { type: Type.STRING, nullable: true },
              businessName: { type: Type.STRING, nullable: true },
              industryCategory: { type: Type.STRING, nullable: true },
              enterpriseSize: { type: Type.STRING, nullable: true },
              state: { type: Type.STRING, nullable: true },
              city: { type: Type.STRING, nullable: true },
              registrationDate: { type: Type.STRING, nullable: true },
              gstNumber: { type: Type.STRING, nullable: true },
              documentType: { type: Type.STRING, nullable: true },
            },
          },
        },
      });

      if (!geminiResponse.text) {
        res.status(500).json({ error: "Couldn't read this document, please enter details manually." });
        return;
      }

      const extractedData = JSON.parse(geminiResponse.text);
      res.json({ success: true, extractedData });
    } catch (err: any) {
      console.error("Error in /api/documents/extract:", err);
      if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("Quota")) {
        res.status(429).json({
          error: "AI assistant is temporarily busy, try again in a moment",
          code: "RATE_LIMIT",
        });
      } else {
        res.status(500).json({
          error: "Couldn't read this document, please enter details manually.",
          details: err?.message || "Extraction error",
        });
      }
    }
  });

  // 5. Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ArthaAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
