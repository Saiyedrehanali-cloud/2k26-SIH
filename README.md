# IP-SAKTI Sahayak (Ministry of Ayush) — SIH26045
> **RAG-Based AI Legal & Regulatory Assistant for Ayurveda Researchers, Herbal Startups & MSMEs**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000.svg?style=flat&logo=next.js)](https://nextjs.org)
[![ChromaDB](https://img.shields.io/badge/Vector%20DB-ChromaDB-FF6F00.svg?style=flat)](https://www.trychroma.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

---

## 📌 Problem Statement
Over 40,000 Ayurvedic enterprises and researchers in India struggle to navigate the complex, overlapping intersection of Intellectual Property Rights (IPR) and biodiversity regulations. Over **70% of herbal patent applications face rejections or revocation** under **Section 3(p)** of the Indian Patents Act (traditional knowledge exclusion) or for lack of mandatory prior approval from the **National Biodiversity Authority (NBA)** under **Section 6** of the Biological Diversity Act, 2002.

**IP-SAKTI Sahayak** solves this by delivering an authenticated, zero-hallucination legal AI assistant strictly grounded in authentic statutory texts.

---

## 🏛️ Authentic Statutory Knowledge Base
Indexed in [`backend/data/raw/`](backend/data/raw/) and mapped via [`manifest.json`](backend/data/raw/manifest.json):
1. **The Patents Act, 1970**: § 3(p) [Traditional Knowledge], § 3(d) [Efficacy Standards], § 3(e) [Admixtures], § 10(4)(ii) [Source Disclosure], § 25 [Pre/Post-Grant Oppositions].
2. **The Biological Diversity Act, 2002**: § 3 & § 6 [Mandatory NBA Approval for IPR], § 7 [State Biodiversity Board Intimation], § 21 [Equitable Benefit Sharing].
3. **Drugs & Cosmetics Rules, 1945**: Rule 158B [Issue of License for ASU Drugs], First Schedule [54 Authoritative Compendia].
4. **TKDL Prior Art Guidelines**: IPC Concordance & CSIR pre-grant opposition defense guidelines (Turmeric & Neem landmark precedent).
5. **WTO TRIPS Agreement**: Articles 27.1, 27.2, 27.3(b), and 29 [Patentable Subject Matter & Exclusions].
6. **Nagoya Protocol on ABS**: Articles 5, 6, 7, 15, 16 [Prior Informed Consent & Mutually Agreed Terms].

---

## ⚙️ Core Architecture

```
                                  ┌────────────────────────┐
                                  │   Next.js 15 Frontend  │
                                  │ (Ayush Light Palette)  │
                                  └───────────┬────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │  Formulation Classifier │                       │    Jurisdiction Toggle  │
        │   (Deterministic Rules) │                       │  (India vs Int'l corpus)│
        └────────────┬────────────┘                       └────────────┬────────────┘
                     │                                                 │
                     ▼                                                 ▼
        ┌───────────────────────────────────────────────────────────────────────────┐
        │                         FastAPI REST Engine (Port 8000)                   │
        │               POST /classify  •  POST /chat  •  GET /health               │
        └─────────────────────────────────────┬─────────────────────────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │ Section-Boundary Chunk  │                       │ Zero-Hallucination      │
        │ Local ChromaDB (ONNX)   │                       │ Guardrail & Refusal Card│
        └─────────────────────────┘                       └─────────────────────────┘
```

---

## 🚀 Quick Start (1-Click or Manual)

### Option 1: 1-Click Windows Launcher (Recommended)
Simply double-click:
```bat
run_app.bat
```
*(Starts the FastAPI backend, Next.js frontend, and launches `http://localhost:3000` in your browser!)*

### Option 2: Terminal Commands
From the project root:

**Terminal 1 (Backend):**
```powershell
python -m uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```powershell
npm run start
# Or for dev mode:
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🧪 Testing & Verification

Run the automated test suites:
```powershell
# Verify Formulation Classifier (6 statutory categories):
python backend/test_classify.py

# Verify ChromaDB RAG, cross-jurisdiction firewall, and refusal guardrails:
python backend/test_rag.py
```

---

## 📋 Presentation Pitch & Live Demo Script
For your live hackathon demo or jury evaluation, refer to:
👉 **[`docs/pitch_and_demo_script.md`](docs/pitch_and_demo_script.md)**
- 3-minute pitch outline
- Step-by-step rehearsed demo script
- Landmark "Trick Question" demonstration
- 1-click "Export Advisory Memo" feature walkthrough

---

## ⚖️ Statutory Disclaimer
*IP-SAKTI Sahayak provides informational guidance derived from authenticated statutory texts. It does not constitute formal legal counsel. Users are advised to consult registered Ayush IP facilitators or patent attorneys for official patent filings.*
