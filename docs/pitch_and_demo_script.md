# IP-SAKTI Sahayak — Pitch & Live Demo Presentation Script
**SIH26045 — Ministry of Ayush**

---

## 🎯 3-Slide Pitch Framework (2–3 Minutes)

### Slide 1: The Problem & The Ayush IPR Trap
- **The Challenge**: Over 40,000 Ayurvedic MSMEs, startups, and researchers in India are innovating with botanical formulations, but **over 70% of patent filings are rejected** under **Section 3(p)** of the Indian Patents Act (traditional knowledge exclusion) or face patent revocation for missing **Section 6 mandatory approval** from the National Biodiversity Authority (NBA).
- **The Trap**: Navigating 5 overlapping legal frameworks (Patents Act 1970, Biological Diversity Act 2002, Drugs & Cosmetics Rule 158B, TKDL prior art, and WTO TRIPS/Nagoya Protocol) requires tens of thousands of rupees in legal consulting fees that grassroots herbal innovators cannot afford.
- **Why Generic LLMs Fail**: General AI models (ChatGPT, Gemini) hallucinate legal sections, blend US patent standards into Indian law, and invent fake sections. In law, **a hallucinated section citation is fatal**.

### Slide 2: The Solution — IP-SAKTI Sahayak
- **Statutory-Grounded Architecture**:
  1. **Deterministic Rule Engine**: 4-step wizard that classifies botanical formulations into statutory categories (*Classical, Proprietary, Phytopharmaceutical, New Drug, Cosmetic, Ayurveda-Aahar*).
  2. **Section-Boundary RAG**: Rather than arbitrary token slicing, chunks authentic legal texts strictly on section/article boundaries.
  3. **Strict Jurisdiction Firewall**: India and International corpuses are physically isolated via vector metadata filters—cross-jurisdiction contamination is impossible.
  4. **Zero-Hallucination Guardrails**: Sub-threshold queries or non-statutory topics immediately trigger a refusal card directing users to human Ayush IP Facilitators.

### Slide 3: Hackathon Differentiation & Scalability Roadmap
- **Low Competition, High Technical Moat**:
  - Requires deep domain expertise in Ayush regulatory law (Rule 158B, BDA Section 6, TKDL).
  - Multi-tier zero-failure stage insurance (local ONNX vector store + offline demo cache).
- **Post-Hackathon Roadmap**:
  - **Multilingual Support**: Bhashini API integration for 10 regional Indian languages.
  - **DPDP & Sovereign Cloud**: Air-gapped local LLMs for trade secret and patent confidentiality.
  - **Live IPO / CDSCO Ingestion**: Nightly syncing of newly published patent office gazettes and NBA guidelines.

---

## 🎬 Live Demo Script (Step-by-Step for Judges)

### Step 1: Landing Page & Problem Teaser (30s)
1. Open **`http://localhost:3000`**.
2. Point out the official **Ministry of Ayush palette**, the persistent disclaimer banner, and the Bento layout.
3. Click **"Classify My Formulation"**.

### Step 2: Formulation Classification Wizard (45s)
1. Select:
   - **Source**: "Classical text with modification in excipients/ratio"
   - **Fraction**: "Whole extract / Crude botanical powder"
   - **Intended Use**: "Therapeutic / Medicinal Treatment"
   - **Prior Art**: "Known in TKDL / Traditional texts"
2. Click **"Generate Classification"**.
3. **Show Judges**: Result badge shows **"Proprietary Medicine"** with statutory explanation referencing Rule 158B and NBA Section 6.
4. Click **"Proceed to Legal Assistant"**.

### Step 3: Live RAG & Grounded Citations (60s)
1. Click the first suggested chip:
   > *"Can I patent an Ashwagandha and Curcumin synergistic polyherbal extract in India?"*
2. **Highlight to Judges**:
   - The response appears with **Confidence: HIGH**.
   - Notice the **Collapsible Citation Drawer**: Expand it to show direct references to **Patents Act Section 3(p)**, **Section 3(e)**, and **Biological Diversity Act Section 6** with live links to `ipindia.gov.in` and `nbaindia.org`.

### Step 4: The Jurisdiction Switch & Cross-Border Compliance (45s)
1. Click the **Jurisdiction Toggle** from **India** to **International**.
2. Notice the UI banner updates to *WTO TRIPS & Nagoya Framework*.
3. Click:
   > *"What Access and Benefit-Sharing (ABS) requirements apply under the Nagoya Protocol for international PCT patents?"*
4. **Highlight to Judges**:
   - The assistant switches corpus completely to **Nagoya Protocol Articles 6 & 15** and **TRIPS Article 27**.
   - Zero contamination between domestic and international laws.

### Step 5: The "Trick Question" & Zero-Hallucination Guardrail (45s)
1. Switch back to **India** jurisdiction.
2. Click:
   > *"Can a foreign multinational file a patent on Indian neem without NBA clearance?"*
3. **Show Judges**:
   - Assistant immediately cites **Biological Diversity Act Section 3 & Section 6**, noting mandatory Form III approval and risk of patent revocation under Section 64.
4. Next, type an out-of-domain question:
   > *"How do I bake a chocolate cake at home?"*
5. **Show Judges**:
   - The assistant **refuses to hallucinate**!
   - Renders the **Regulatory Guardrail Triggered** card with an orange dashed border and a 1-click **"Consult an IP Facilitator"** button.

### Step 6: The Grand Finale — 1-Click Advisory Report (15s)
1. In the header bar, click **"Export Advisory Memo"**.
2. Show judges the downloaded official Markdown document containing the complete statutory audit trail, timestamps, and full legal citations ready for presentation to patent attorneys!
