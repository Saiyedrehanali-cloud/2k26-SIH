# System Architecture & Tech Stack: Vigyan Veda (IP-SAKTI Sahayak)

## 1. Stack Summary

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | Fast static compilation (`output: export`), offline stability, Netlify hostable |
| Styling | Tailwind CSS | Custom 5-color botanical green palette + responsive Bento Box UI |
| State | React hooks + session persistence | Zero bloat, instant cross-page state retention |
| Backend | Python + FastAPI | Fast async endpoints, Pydantic data schemas |
| Vector DB | Chroma (local, file-based) | Zero cloud latency or venue Wi-Fi failure risk |
| Registry DB | SQLite3 (`research_registry.db`) | Instant local pre-registration & fuzzy prior art conflict checking |
| Botanical Database | Classical Ayurvedic JSON (`tkdl_herbs.json`) | Section 3(p) analysis, classical text citations, NBA § 6 ABS rules |
| LLM | Claude / GPT-4o with deterministic statutory fallback | Rigorous legal reasoning and strict citation enforcement |

## 2. High-Level Data Flow

```
User → [Jurisdiction Toggle: India | International]
     → [Formulation Classifier] (determines ASU classification)
     → Chat message
         → FastAPI /chat endpoint
             → Check Innovation Registry for overlapping prior art claims (fuzzy/botanical)
             → Retrieve top-k statutory chunks from Chroma (filtered by jurisdiction)
             → Build prompt: system instructions + context + conflict alerts + question
             → Call LLM / Deterministic Statutory Synthesizer
             → Parse response into {answer, citations[], confidence, conflict_alert}
         → Frontend renders:
             → Conflict Alert Card (if overlapping prior art exists)
             → Answer prose
             → Citations Drawer (with clickable statutory refs)
             → Confidence badge (High / Medium / Low)
```

## 3. Repository Structure

```
vigyan-veda/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Vigyan Veda landing & feature showcase
│   │   ├── chat/page.tsx            # Main chat interface with conflict alerts
│   │   ├── explorer/page.tsx        # Botanical Prior Art & TKDL Explorer
│   │   └── layout.tsx               # Root layout, Vigyan Veda metadata & logo icon
│   ├── components/
│   │   ├── JurisdictionToggle.tsx   # India / International toggle
│   │   ├── FormulationClassifierModal.tsx
│   │   ├── ResearchRegistrationModal.tsx # Pre-filing research ledger modal
│   │   ├── ChatBubble.tsx           # Multi-card bubble with conflict warnings
│   │   ├── CitationDrawer.tsx
│   │   ├── ConfidenceBadge.tsx
│   │   └── DisclaimerBanner.tsx
│   ├── public/
│   │   └── logo.png                 # Official Vigyan Veda botanical circuit logo
│   ├── lib/
│   │   ├── api.ts                   # REST API wrappers
│   │   └── types.ts                 # TypeScript interfaces
│   └── package.json
├── backend/
│   ├── main.py                      # FastAPI app entrypoint
│   ├── registry_db.py               # SQLite Innovation Registry manager
│   ├── routers/
│   │   ├── chat.py                  # POST /chat (RAG + Conflict Checker)
│   │   ├── classify.py              # POST /classify (Rule decision tree)
│   │   ├── registry.py              # POST /registry/add, GET /registry/list
│   │   └── explorer.py              # GET /explorer/all, GET /explorer/search
│   ├── data/
│   │   ├── tkdl_herbs.json          # Classical Ayurveda & TKDL dataset
│   │   ├── research_registry.db     # SQLite persistence for pending prior art
│   │   └── raw/                     # Seeded statutory texts
│   ├── models.py                    # Pydantic schemas
│   └── requirements.txt
├── prd.md
├── architecture.md
├── netlify.toml
└── package.json
```

## 4. API Contracts

### POST `/classify`
Request:
```json
{ "answers": { "is_traditional_formula": true, "is_novel_compound": false, "intended_use": "medicine" } }
```
Response:
```json
{ "classification": "Classical Medicine", "explanation": "Formulation matches a known classical text reference; generally not patentable but may require ABS disclosure." }
```

### POST `/chat`
Request:
```json
{
  "message": "Can I patent this Ashwagandha-based formulation?",
  "jurisdiction": "india",
  "classification": "Proprietary Medicine",
  "session_id": "uuid"
}
```
Response:
```json
{
  "answer": "Proprietary Ayurvedic medicines with a novel formulation ratio may be patentable under Indian law, subject to Section 3(p) exclusions for traditional knowledge...",
  "citations": [
    { "source": "The Patents Act, 1970 — Section 3(p)", "ref_id": "IN-PAT-3P", "url": null }
  ],
  "confidence": "medium",
  "jurisdiction": "india"
}
```

### Data model — `models.py` (Pydantic)
```python
class Citation(BaseModel):
    source: str
    ref_id: str
    url: str | None = None

class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation]
    confidence: Literal["high", "medium", "low"]
    jurisdiction: Literal["india", "international"]

class ClassificationResult(BaseModel):
    classification: Literal[
        "Classical Medicine", "Proprietary Medicine", "New Drug",
        "Phytopharmaceutical", "Ayurveda-Aahar", "Cosmetic"
    ]
    explanation: str
```

## 5. RAG Pipeline Detail
1. **Ingestion** (`rag/ingest.py`): load seeded documents from `data/raw/`, tag each chunk with `jurisdiction: india | international` metadata, chunk semantically (keep statute sections intact — split on section/article boundaries, not fixed token windows), embed, store in Chroma.
2. **Retrieval** (`rag/retrieve.py`): similarity search filtered by the active jurisdiction metadata field — this is what guarantees India/International answers never mix.
3. **Generation** (`rag/prompts.py`): system prompt forces the LLM to (a) answer only from provided context, (b) output citations in a strict parseable format, (c) say "I don't have a confident source" if context is insufficient. Parse the LLM output; if citations can't be extracted, treat as low-confidence and don't surface as a final answer.

## 6. Environment Variables
```
OPENAI_API_KEY=          # or ANTHROPIC_API_KEY, depending on LLM choice
EMBEDDING_MODEL=text-embedding-3-small
CHROMA_PERSIST_DIR=./backend/data/chroma_db
CONFIDENCE_THRESHOLD=0.6
```

## 7. Deployment (for demo)
- Run both frontend (`npm run dev`) and backend (`uvicorn main:app`) locally on the presenting laptop — avoids relying on venue wifi/hosting for the live demo.
- Optional: deploy a backup hosted version (Vercel for frontend, Render/Railway for backend) in case judges want to test on their own device.
