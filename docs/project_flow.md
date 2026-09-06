# Execution Roadmap: IP-SAKTI Sahayak (36-Hour Build)

> Budget generously toward the RAG pipeline and demo rehearsal — a broken citation flow live on stage is the single biggest risk (see `prd.md` §7).

## Phase 0 — Before the clock starts (prep, do this ahead of time if possible)
- Collect 5–8 real source documents: relevant sections of the Patents Act 1970, Biological Diversity Act 2002, a few TKDL public entries, TRIPS Art. 27, Nagoya Protocol excerpts. Save as text/PDF in `backend/data/raw/`, tagged by jurisdiction.
- Write out the 8–10 demo questions you will ask live, and know the correct citation for each.

## Phase 1 — Hours 0–4: Scaffolding
- Initialize `frontend/` (Next.js + Tailwind, apply color palette from `ui_ux_guidelines.md`) and `backend/` (FastAPI skeleton) per `architecture.md` folder structure.
- Build static UI shell: header with Jurisdiction Toggle, chat layout, disclaimer banner — no live data yet, use mock responses.
- **Checkpoint:** app runs locally, toggle switches state, chat UI renders a hardcoded message with citation drawer + confidence badge.

## Phase 2 — Hours 4–10: Formulation Classifier
- Build the modal flow (`FormulationClassifierModal.tsx`) and `POST /classify` endpoint — this can be simple rule-based logic, not LLM-driven, since the classification rules are deterministic.
- **Checkpoint:** classifier produces correct output for 5 test formulations you define manually.

## Phase 3 — Hours 10–20: RAG Pipeline
- Write `rag/ingest.py`: chunk seeded documents (split on section boundaries, not fixed windows), embed, store in Chroma with jurisdiction metadata.
- Write `rag/retrieve.py`: jurisdiction-filtered similarity search.
- Write `rag/prompts.py`: system prompt enforcing citation-required output format; write the parser that extracts `{answer, citations, confidence}` from the LLM response.
- Wire up `POST /chat` end to end.
- **Checkpoint:** all 8–10 rehearsed demo questions return correct, citable answers in the correct jurisdiction.

## Phase 4 — Hours 20–26: Guardrails & Escalation
- Implement the confidence threshold + refusal state (low-confidence card, no citation drawer).
- Add the "Talk to an IP facilitator" escalation CTA (static contact form/mailto is fine for MVP).
- Test the "trick question" that mixes jurisdictions — confirm the assistant does not conflate India/International answers.

## Phase 5 — Hours 26–30: Polish
- Visual QA against `ui_ux_guidelines.md`: spacing, color accuracy, confidence badge colors, disclaimer persistence.
- Add loading/error states to chat input.
- Cache the exact rehearsed demo Q&A pairs locally as a fallback in case live wifi/API fails on stage.

## Phase 6 — Hours 30–36: Demo Prep
- Rehearse the full demo script end to end at least 3 times, including the "trick question" moment.
- Prepare a 2–3 slide pitch covering: problem, why this is low-competition/high-difficulty, the hallucination-guardrail architecture, and the post-MVP roadmap (multilingual, DPDP compliance, live ingestion) from `prd.md` §3.2.
- Confirm the local fallback (cached responses) works with wifi disabled.

## Fallback Plan
If the RAG pipeline is not reliable by Hour 26, cut over to: static, pre-embedded answers for the exact rehearsed demo questions only, clearly presented as "live retrieval, cached for demo stability" — do **not** silently fake it; judges respect an honest scoping call more than a fragile system that breaks live.
