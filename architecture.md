# System Architecture & Tech Stack: IP-SAKTI Sahayak

## 1. Stack Summary

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | fast scaffolding, good agent support |
| Styling | Tailwind CSS | matches Bento Box design system quickly |
| State | React Context (chat + jurisdiction state) | app is small enough to not need Zustand/Redux |
| Backend | Python + FastAPI | fast to scaffold, async, good LangChain support |
| RAG orchestration | LangChain (or LlamaIndex) | retrieval + citation extraction |
| Vector DB | Chroma (local, file-based) for the hackathon; Pinecone/Weaviate noted as production upgrade | Chroma needs no external account/API key — safer for a live demo with venue wifi |
| LLM | Claude or GPT-4o via API, with a local fallback of cached responses | reasoning quality + instruction-following on citation format |
| Embeddings | OpenAI `text-embedding-3-small` or equivalent | cheap, fast for a small corpus |

> **Demo-day note:** prefer Chroma (local, no network dependency) over a hosted vector DB. Venue wifi is the #1 cause of hackathon demo failures. Swap to Pinecone/Weaviate only after the live demo is derisked.

## 2. High-Level Data Flow

```
User → [Jurisdiction Toggle: India | International]
     → [Formulation Classifier] (optional, sets context)
     → Chat message
         → FastAPI /chat endpoint
             → Retrieve top-k chunks from Chroma, filtered by jurisdiction metadata
             → Build prompt: system instructions + retrieved context + user question
             → Call LLM
             → Parse response into {answer, citations[], confidence}
             → If citations[] is empty → return "low confidence" fallback, do not show as final answer
         → Frontend renders: answer bubble + citations drawer + confidence badge
```

## 3. Repository Structure

```
ip-sakti-sahayak/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # landing + jurisdiction toggle entry
│   │   ├── chat/page.tsx            # main chat interface
│   │   └── layout.tsx
│   ├── components/
│   │   ├── JurisdictionToggle.tsx
│   │   ├── FormulationClassifierModal.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── CitationDrawer.tsx
│   │   ├── ConfidenceBadge.tsx
│   │   └── DisclaimerBanner.tsx
│   ├── lib/api.ts                   # fetch wrappers to backend
│   ├── tailwind.config.ts
│   └── package.json
├── backend/
│   ├── main.py                      # FastAPI app entrypoint
│   ├── routers/
│   │   ├── chat.py                  # POST /chat
│   │   └── classify.py              # POST /classify
│   ├── rag/
│   │   ├── ingest.py                # chunk + embed + store documents
│   │   ├── retrieve.py              # jurisdiction-filtered similarity search
│   │   └── prompts.py               # system prompts, citation-format enforcement
│   ├── data/
│   │   ├── raw/                     # seeded PDFs / legal texts
│   │   └── chroma_db/               # local vector store (generated)
│   ├── models.py                    # Pydantic schemas
│   └── requirements.txt
├── docs/
│   ├── prd.md
│   ├── architecture.md
│   ├── ui_ux_guidelines.md
│   └── project_flow.md
└── README.md
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
