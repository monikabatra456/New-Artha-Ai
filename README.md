 ArthaAI

Production-quality MSME opportunity-matching platform. A mobile-first React SPA with an Express (Node.js 20) backend that matches an Indian MSME business profile against a verified government-scheme knowledge base using a deterministic 6-factor scoring engine. Gemini is used only as an optional explanation / assistant / document-reading layer — matching never depends on it.

## Architecture
Profile (typed, voiced, or document-extracted)
  → POST /api/analyze
    → normalizeProfile() → knowledge-base retrieval → criteria evaluation (PASS/FAIL/UNKNOWN)
    → 6-factor deterministic scoring → action-plan synthesis
    → optional Gemini explanation of the already-computed result
  → Sanitized AnalysisResult (works even if GEMINI_API_KEY is missing)

- Frontend: React 19 + Vite + Tailwind, dark/light mode
- Backend: Express on 0.0.0.0:$PORT, all AI calls brokered through /api/*
- Security: GEMINI_API_KEY is server-side only, never sent to client
- Fallback: if Gemini unavailable, deterministic RAG result is served unchanged

### 6-factor scoring (src/services/ragEngine.ts)
Industry (30), Enterprise Size (20), State (15), Udyam (10), Eligibility Fit (20), Source Recency (5).
Scores below 60 filtered out.

## Key Features
- Deterministic matching pipeline (ragEngine.ts + actionEngine.ts)
- POST /api/analyze, GET /api/health, /api/schemes, /api/monitor/status
- Conversational AI assistant — POST /api/assistant/chat, grounded in ranked KB
- Voice input (Web Speech API) — en-US default, hi-IN toggle
- Document upload (Udyam/GST) — POST /api/documents/extract, Gemini vision, in-memory only (multer.memoryStorage())
- Client-side fallback scoring if API unreachable
- In-app test suite (Tools → Verify Engine Tests)

## Run locally
npm install
npm run dev  →  http://localhost:3000
npm run lint (tsc --noEmit) / npm run build / npm start
