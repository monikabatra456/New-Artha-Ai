# ArthaAI

Production-quality MSME opportunity-matching platform. A mobile-first React SPA with an Express (Node.js 20) backend that matches an Indian MSME business profile against a verified government-scheme knowledge base using a **deterministic 6-factor scoring engine**. Gemini is used only as an optional explanation / assistant / document-reading layer — matching never depends on it.

## Architecture

```
Profile (typed, voiced, or document-extracted)
        │
        ▼
POST /api/analyze
        │
        ├─ normalizeProfile()
        ├─ knowledge-base retrieval
        ├─ criteria evaluation (PASS / FAIL / UNKNOWN)
        ├─ 6-factor deterministic scoring
        ├─ action-plan synthesis
        └─ optional Gemini explanation of the already-computed result
        │
        ▼
Sanitized AnalysisResult  (works even if GEMINI_API_KEY is missing)
```

- **Frontend:** React 19 + Vite + Tailwind, dark/light mode
- **Backend:** Express on `0.0.0.0:$PORT`, all AI calls brokered through `/api/*`
- **Security:** `GEMINI_API_KEY` is server-side only and is never sent to the client
- **Fallback:** if Gemini is unavailable, the deterministic RAG result is served unchanged

### 6-factor scoring (real engine in `src/services/ragEngine.ts`)

| Factor | Weight |
| --- | --- |
| Industry | 30 |
| Enterprise Size | 20 |
| State | 15 |
| Udyam | 10 |
| Eligibility Fit | 20 |
| Source Recency | 5 |

Scores below 60 are filtered out. Relevance is independent of eligibility (PASS/FAIL/UNKNOWN checks).

## Currently Implemented

- **Deterministic matching pipeline** — profile normalization, KB retrieval, criteria evaluation, 6-factor scoring, action-plan synthesis. Lives in `src/services/ragEngine.ts` and `src/services/actionEngine.ts`. Not a stub.
- **POST `/api/analyze`** — `{ profile: BusinessProfile }` → `AnalysisResult`. Gemini may rewrite `summary` when configured; otherwise `generatedVia: "rag_verified_engine"`.
- **GET `/api/health`**, **GET `/api/schemes`**, **GET `/api/monitor/status`**.
- **Conversational AI assistant** — `POST /api/assistant/chat` with `{ message, conversationHistory, businessProfile? }`. Uses the same `getAiClient()` / `GEMINI_API_KEY` as explanations. Grounded in the ranked knowledge base; will not invent schemes. Frontend chat panel (bubbles, send lock, 429 copy: *"AI assistant is temporarily busy, try again in a moment"*). If the key is missing, the panel shows **"AI assistant unavailable"** and matching still works.
- **Voice input (Web Speech API)** — mic on the assistant input and on onboarding / profile text fields. Idle / listening / processing states. Transcript populates the field for review; never auto-submits. Unsupported browsers get a disabled mic with a tooltip. Default language `en-US`; Hindi `hi-IN` toggle on the assistant.
- **Document upload (Udyam / GST)** — `POST /api/documents/extract` accepts multipart PDF/JPG/PNG (5MB). Gemini vision returns structured JSON; empty/unread fields are `null`. Files are processed **in memory** (`multer.memoryStorage()`) and discarded — nothing is written to disk. Frontend drag-and-drop zone, preview of extracted fields, user must click **Apply to Form** before matching runs.
- **Client fallback** — if `/api/analyze` is unreachable, `analyzeBusinessProfile()` runs the same scoring engine in the browser so the demo cannot go blank.
- **In-app test suite** — Tools → Verify Engine Tests.

## API

### `POST /api/analyze`

Request:

```json
{ "profile": { "industry": "Textiles", "size": "Small", "udyamStatus": "registered", "state": "Delhi" } }
```

Required profile fields: `industry`, `size`, `state`.

Response: `AnalysisResult` (`summary`, `tenders`, `subsidies`, `loans`, `certifications`, `compliance_alerts`, `export_opportunities`, `action_plan`, `top3Actions`, `generatedVia`, score breakdowns per match).

### `POST /api/assistant/chat`

```json
{
  "message": "what documents do I need for CGTMSE",
  "conversationHistory": [{ "role": "user", "content": "..." }],
  "businessProfile": { "industry": "Textiles", "size": "Small", "state": "Delhi", "udyamStatus": "registered" }
}
```

- `200` `{ "response": "..." }`
- `503` `{ "code": "AI_UNAVAILABLE" }` when `GEMINI_API_KEY` is missing
- `429` `{ "code": "RATE_LIMIT" }` on free-tier quota

### `POST /api/documents/extract`

`multipart/form-data` field `document` (PDF / JPEG / PNG / WebP, ≤ 5MB).

- `200` `{ "success": true, "extractedData": { "udyamNumber", "businessName", "industryCategory", "enterpriseSize", "state", "city", "registrationDate", "gstNumber", "documentType" } }`
- Unreadable files return a clear error: *"Couldn't read this document, please enter details manually."*

Uploaded bytes live only on `req.file.buffer` for that request.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | No (matching works without it) | Server-side Gemini client |
| `GEMINI_MODEL` | No | Default `gemini-2.5-flash` |
| `PORT` | No | Default `3000`; server binds `0.0.0.0:$PORT` |

Copy `.env.example` to `.env`. Never put the API key in frontend code.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

```bash
npm run lint    # tsc --noEmit
npm run build
npm start       # production: node dist/server.cjs
```

## Deploy

The repository includes a production `Dockerfile` and a `render.yaml` blueprint.

For any Docker host:

```bash
docker build -t artha-ai .
docker run --env-file .env -p 3000:3000 artha-ai
```

The container listens on `0.0.0.0:$PORT` and exposes `GET /api/health` for health checks. Set `GEMINI_API_KEY` as a server-side environment variable in the hosting provider; never commit `.env`.

On Render, create a new Blueprint from this repository and provide `GEMINI_API_KEY` when prompted. The service uses the included health check and automatically receives Render's `PORT` value.

## Project layout

```
server.ts                         Express + Gemini client + API routes
src/App.tsx                       SPA views (landing, onboarding, dashboard)
src/components/ChatAssistantPanel.tsx
src/components/VoiceInputButton.tsx
src/components/DocumentUploadSection.tsx
src/services/ragEngine.ts         6-factor scoring + assistant KB ranking
src/services/actionEngine.ts
src/services/apiClient.ts         /api/* client (no secrets)
src/data/msmeKnowledgeBase.ts     Verified scheme records
```
