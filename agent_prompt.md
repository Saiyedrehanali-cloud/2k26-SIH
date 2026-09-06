# Antigravity Kickoff Prompt

Paste this into Antigravity once `prd.md`, `architecture.md`, `ui_ux_guidelines.md`, and `project_flow.md` are all in your project's `docs/` folder (or project root).

---

**Prompt:**

> I'm building "IP-SAKTI Sahayak," a RAG-based legal AI assistant for a hackathon, under a 36-hour build deadline. I've defined the full spec in four files: `prd.md` (requirements and MVP scope), `architecture.md` (tech stack, repo structure, API contracts, data models), `ui_ux_guidelines.md` (design system — bright light-mode, Bento Box layout, teal/orange palette), and `project_flow.md` (hour-by-hour execution plan).
>
> Please read all four files fully before writing any code. Pay special attention to:
> 1. The MVP scope in `prd.md` §3.1 — do not build anything from §3.2/§3.3 yet.
> 2. The exact repo structure in `architecture.md` §3 — create it as specified.
> 3. The citation-required response format in `architecture.md` §5 — every chat answer must be parseable into `{answer, citations[], confidence}`, and a response with no citations must never render as a normal final answer.
>
> Start with Phase 1 from `project_flow.md`: scaffold `frontend/` (Next.js + Tailwind, using the exact color palette from `ui_ux_guidelines.md` §2) and `backend/` (FastAPI skeleton matching `architecture.md` §3). Build the static UI shell — header with the Jurisdiction Toggle, chat layout, persistent disclaimer banner — using mock/hardcoded chat data for now, no live RAG pipeline yet. Stop after that and let me review before moving to Phase 2.

---

## Follow-up prompts (use after reviewing each phase)

**After Phase 1 review:**
> Good. Now implement Phase 2: the Formulation Classifier modal and `POST /classify` endpoint per `prd.md` §3.1 item 1 and `architecture.md` §4. This should be deterministic rule-based logic, not an LLM call.

**Before starting Phase 3 (RAG):**
> Now implement Phase 3: the RAG pipeline. I will provide 5–8 source documents in `backend/data/raw/`, each tagged with a jurisdiction (india/international) in the filename or a manifest file — check for a `manifest.json` there first. Build `rag/ingest.py`, `rag/retrieve.py`, and `rag/prompts.py` exactly per `architecture.md` §5. The system prompt must force the LLM to answer only from retrieved context and to output citations in a strictly parseable format — if you can't extract citations from the LLM output, treat the response as low-confidence rather than guessing.

**For guardrails:**
> Implement Phase 4 from `project_flow.md`: the confidence threshold and refusal-state UI (per `ui_ux_guidelines.md` §4.4), and the escalation CTA. Test with a query that would require mixing India and International sources — confirm the jurisdiction filter in `rag/retrieve.py` prevents this.
