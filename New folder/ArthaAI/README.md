# ArthaAI — AI Business Officer for Indian MSMEs

> **Personalized Opportunity Intelligence for India's 6.3 Crore MSMEs**  
> *"Tell ArthaAI about your business. It finds the opportunities that fit, explains why they matter, and tells you what to do next."*

---

## 📌 Problem & Opportunity

- **Information Fragmentation**: Indian MSMEs miss out on government schemes, public procurement quotas, fee subsidies, and credit guarantee programs because information is scattered across dozens of central and state portals.
- **Generic AI Inadequacy**: General AI chatbots often invent non-existent schemes, confuse eligibility criteria, hallucinate dates, or generate vague advice without official source links.
- **Execution Gap**: Finding a scheme name is only half the battle—business owners need to know *why* their specific enterprise qualifies, what requirements remain unknown, and what exact steps to take next.

---

## 💡 The ArthaAI Solution & USP

**Finding information is easy. Knowing which information is worth acting on is the problem ArthaAI solves.**

ArthaAI is not a generic chatbot, a static directory, or an ungrounded text generator. It is a **deterministic, profile-aware opportunity intelligence system**:

1. **Structured Knowledge Base**: Grounded in structured records of Central and State government schemes, public procurement quotas, credit guarantees, and statutory protections.
2. **Match Score ≠ Eligibility**: Separates mathematical match relevance (0–100%) from strict eligibility status (*Likely eligible*, *Potentially eligible*, *Needs verification*, *Not eligible*). Unknown criteria (such as turnover thresholds or specific audit reports) remain honestly marked as `UNKNOWN`.
3. **Transparent "Why This Matched"**: Every score is accompanied by an openable breakdown displaying the exact matching factors (Industry, Enterprise Size, State, Udyam Registration, Operational Fit).
4. **Prioritized Action Engine**: Synthesizes a structured, actionable implementation checklist linking directly to verified official government portals (e.g. GeM, Udyam, CGTMSE, MSME SAMADHAAN).
5. **Grounded AI Explanation Layer**: AI is strictly constrained to explaining and summarizing retrieved evidence on the backend—it never invents schemes, URLs, or scores.

---

## 🔄 User Flow (60–90 Second Demo)

```
[ Tell Us About Your Business ] (Industry → Enterprise Size → Udyam Status → Location)
             │
             ▼
[ Building Your Opportunity Map ] (Truthful stages: Understanding → Retrieving → Checking Fit → Prioritizing)
             │
             ▼
[ START HERE ] ("Things worth your attention" — 2 to 3 highest-impact opportunities)
             │
             ▼
[ WHY THIS MATCHED ] (Interactive criteria check: Industry ✓, Size ✓, Location ✓, Udyam ✓, Unknowns ?)
             │
             ▼
[ YOUR ACTION PLAN ] (Implementation Checklist: Check eligibility → Prepare docs → Review source → Apply)
             │
             ▼
[ ALL OPPORTUNITIES ] (Categorized & searchable: Subsidies, Loans, GeM Tenders, Certifications, Compliance, Exports)
             │
             ▼
[ VIEW OFFICIAL SOURCE ] (Direct launch to official government portal)
```

---

## 🏛️ Architecture & RAG Pipeline

```
┌────────────────────────────────────────────────────────┐
│                   Mobile-First React SPA               │
└───────────────────────────┬────────────────────────────┘
                            │ (POST /api/analyze)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express Server (Node.js 20)              │
├────────────────────────────────────────────────────────┤
│ 1. Profile Normalization & Validation                  │
│ 2. Deterministic Knowledge Base Retrieval              │
│ 3. Criteria & Requirement Evaluation (PASS/FAIL/UNK)   │
│ 4. 6-Factor Relevance Scoring (0 - 100%)               │
│ 5. Priority & Action Plan Synthesis                    │
│ 6. Grounded LLM Explanation Enrichment (Gemini SDK)    │
│ 7. Validation & Sanitized API Response                 │
└────────────────────────────────────────────────────────┘
```

### Deterministic 6-Factor Scoring Model
- **Industry Sector Match**: 30 points
- **Enterprise Size (Micro / Small / Medium)**: 20 points
- **State Jurisdiction / Pan-India**: 15 points
- **Udyam Registration Status**: 10 points
- **Eligibility Criteria Fit**: 20 points
- **Source Record Recency**: 5 points

### Robust Offline / LLM Fallback
If the server LLM is unavailable or unconfigured, ArthaAI automatically serves the verified deterministic opportunity map and action plan without degrading the user experience.

---

## 🔒 Security Architecture

- **Zero Client-Side API Keys**: No private API credentials (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, etc.) are exposed to the browser.
- **Server-Side AI Calls**: All model interactions are strictly brokered through backend `/api/*` endpoints.
- **Safe Observability**: `/api/health` reports system status, verified record counts, and engine readiness without leaking secrets.

---

## 🚀 Deployment & Local Setup

### 1. Local Development
```bash
# Clone the repository
git clone https://github.com/your-org/artha-ai.git
cd artha-ai

# Install dependencies
npm install

# Run the development server
npm run dev
```
Visit `http://localhost:3000`.

### 2. Production Build
```bash
npm run build
npm start
```

### 3. Docker Deployment
```bash
# Build multi-stage Docker image
docker build -t arthaai .

# Run Docker container
docker run --rm -p 3000:3000 -e PORT=3000 arthaai
```

### 4. Deploying to Render / Cloud Run
- **Runtime**: Node / Docker (multi-stage build provided).
- **Environment Variables**:
  - `PORT`: Automatically assigned (defaults to `3000`).
  - `GEMINI_API_KEY`: Server-side API key for optional LLM executive summaries.
  - `GEMINI_MODEL`: `gemini-2.5-flash` (or compatible model).
- **Health Check Endpoint**: `/api/health` (returns HTTP 200 OK).

---

## 📊 Currently Implemented vs. Future Roadmap

### ✅ Currently Implemented in MVP
- Complete mobile-first opportunity matching UI (360px–896px touch-optimized).
- 4-step onboarding flow + 1-click compact demo presets (Textile, Food, Tech, Artisan).
- 6-factor deterministic scoring and separate 4-tier eligibility validation.
- Interactive "Why This Matched" bottom sheet with granular criteria checks.
- Prioritized "START HERE" section and interactive Action Plan checklist with copy feature.
- Category filtering (Subsidies, Loans, Tenders, Certifications, Compliance, Exports), text search, and multi-option sorting (Relevance, Priority, Newest, Deadline).
- Dark / Light mode with persistent preferences.
- Server-side Gemini AI integration with deterministic fallback.
- Multi-stage Docker containerization and Render-compatible health checks.

### 🔮 Future Product Roadmap
- **Automated Source Ingestion**: Scheduled scrapers and webhooks for live e-gazette and tender bulletin updates.
- **Proactive Deadline Alerts**: SMS / WhatsApp notifications for closing dates and compliance milestones.
- **Document Pre-Filling**: Automated draft generation for standard MSME application forms and invoices.
- **Multi-lingual Support**: Localization into Hindi, Tamil, Telugu, Marathi, and Bengali.

---

## ⚖️ Limitations & Ethical Stance

- **Source Attribution**: ArthaAI grounds recommendations in official government publications, guidelines, and statutory portals. All actions provide direct links to the relevant ministry portal.
- **Professional Verification**: ArthaAI provides intelligence and structured guidance; it does not replace statutory chartered accountancy or legal counsel for complex tax dispute litigation.
#   A r t h a A I  
 