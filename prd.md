# Product Requirements Document: IP-SAKTI Sahayak

**Problem Statement:** SIH26045 — Ministry of AYUSH
**One-liner:** A multilingual, RAG-based AI assistant that helps Ayurveda researchers, startups, and practitioners navigate IP, patent, geographical indication, and biodiversity regulations — with zero hallucinated legal claims.

---

## 1. Problem Background

Ayurvedic innovators (researchers, startups, traditional practitioners) must navigate a fragmented legal landscape: Indian patent law, the Biological Diversity Act, GI registration, AYUSH drug classification rules, and international frameworks like TRIPS and the Nagoya Protocol. Today this requires expensive legal consultation or manual research across scattered PDFs and portals. Mistakes (e.g. treating a classical formulation as patentable, or conflating Indian ABS rules with international ones) can cause IP loss or non-compliance.

## 2. Target Users

| User | Need |
|---|---|
| Ayurveda startup founder | "Can I patent this formulation? What do I file, and where?" |
| Academic researcher | "Is this compound covered by TKDL? Do I need ABS clearance to publish?" |
| AYUSH regulatory officer | "Quick reference tool to check applicant claims against the law" |
| IP facilitator / lawyer | Wants an assistant that pre-screens queries and cites sources, not one that replaces them |

## 3. Scope

### 3.1 MVP — Hackathon Demo (build this first, this is what judges see)
1. **Formulation Classifier** — guided Q&A (4–6 questions) that outputs one of: Classical Medicine / Proprietary Medicine / New Drug / Phytopharmaceutical / Ayurveda-Aahar / Cosmetic, plus a one-line explanation of why.
2. **Jurisdiction Toggle** — India / International, switching which law corpus the RAG pipeline queries. Must be visually unmistakable (not a subtle switch).
3. **RAG Chat with Mandatory Citations** — every answer shows source statute/rule name, a link or reference ID, and a confidence badge (High / Medium / Low). No citation → the UI blocks the answer from rendering as final.
4. **"Not Legal Advice" Disclaimer** — persistent banner, cannot be dismissed permanently, reappears every session.
5. **Human Escalation CTA** — a button that says "Talk to an IP facilitator" (can be a static contact form/mailto for the demo).
6. **Seeded Knowledge Base** — a small, curated set of real documents (Patents Act sections, Biological Diversity Act, a few TKDL entries, TRIPS/Nagoya excerpts) — enough to answer 8–10 rehearsed demo questions correctly and citably.
7. **The Innovation Registry & Conflict Checker** — A secure pre-registration ledger (`research_registry.db`) where startups log ongoing research/formulation claims. When a user queries a similar compound, the RAG engine warns them of "Pending Prior Art" from another entity.
8. **The Herb & TKDL Explorer** — A dedicated search dashboard (`/explorer`) acting as an encyclopedia for Ayurvedic plants (Ashwagandha, Turmeric, Neem, Tulsi, Brahmi, Guggulu, etc.), cross-referencing TKDL citations, Section 3(p) patent exclusions, and National Biodiversity Authority (NBA § 6) Access & Benefit Sharing rules.

### 3.2 Post-MVP / National Round (mention in pitch, build if time allows)
- Multilingual voice + text via Bhashini API.
- DPDP Act–aligned audit logging and consent flows.
- Continuous ingestion pipeline from live TKDL/IP India sources.
- Admin dashboard for legal team to review/flag low-confidence answers.

### 3.3 Explicitly Out of Scope for the 36-hour build
- Real-time scraping of government portals (use static seeded documents instead).
- Production-grade auth/user accounts (a simple session is enough).
- Full multilingual support beyond a demo toggle (hardcode 1–2 languages if time allows; don't build the full Bhashini integration under time pressure).

## 4. Core Functional Requirements
- FR1: User completes formulation classification before or during chat (classification result persists in session and is shown as a chip in the chat header).
- FR2: Every chat message sent while "International" jurisdiction is active must only retrieve from the international corpus, and vice versa. No cross-contamination.
- FR3: Every AI-generated answer is decomposed into: (a) direct answer, (b) citation list, (c) confidence score. The frontend renders these as three distinct visual elements, not one blob of text.
- FR4: If retrieval confidence is below a threshold, the assistant must respond with "I don't have a confident source for this — please consult a facilitator" rather than guessing.
- FR5: Disclaimer text is server-rendered/injected on every AI response, not just shown once in the UI shell (so it can't be missed or removed by frontend state bugs).
- FR6: When an incoming chat query matches a pre-registered research claim in `research_registry.db`, the AI must inject a prominent Conflict Alert card warning the user of pending prior art.
- FR7: The Herb Explorer route `/explorer` must provide instant search, classification filtering, and expandable botanical dossiers with Section 3(p) analysis and NBA ABS requirements.

## 5. Non-Functional Requirements
- **Accuracy over fluency**: prefer "I don't know" to a plausible-sounding wrong answer.
- **Response latency**: under ~4s for demo queries (pre-warm the vector DB, keep the seeded corpus small).
- **Auditability**: every answer traceable to a specific source chunk (store chunk IDs alongside the response, even if not shown in MVP UI).

## 6. Success Metrics (for judges)
- Can correctly classify 5 sample formulations live, on stage, without pre-scripted inputs.
- Can answer a "trick question" that mixes Indian and international law and correctly refuses to conflate them.
- Every demo answer shows a real, verifiable citation.

## 7. Risks
| Risk | Mitigation |
|---|---|
| LLM hallucinates a citation | Enforce citation-required response format at the prompt/parsing layer; reject and retry if no citation is extracted |
| Vector DB / API downtime during judging | Have a local fallback: cached responses for the rehearsed demo question set |
| Scope creep (multilingual, live scraping) | Explicitly cut per section 3.3 above; state it as "future roadmap" in the pitch, not "built" |
