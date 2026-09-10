import os
import sqlite3
import json
import re
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "data" / "research_registry.db"

def get_db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_registry_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS research_registry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reg_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        herb_name TEXT NOT NULL,
        applicant_name TEXT NOT NULL,
        applicant_type TEXT NOT NULL,
        stage TEXT NOT NULL,
        claims_summary TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE_PENDING',
        security_hash TEXT NOT NULL
    );
    """)

    # Seed initial demo registrations if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM research_registry")
    row = cursor.fetchone()
    if row["cnt"] == 0:
        initial_records = [
            (
                "AYUSH-REG-2026-0412",
                "Standardized Aqueous Extract of Withania somnifera (Ashwagandha) for Generalized Anxiety Disorder and Cortisol Reduction",
                "Ashwagandha (Withania somnifera)",
                "NeuroAyur BioLabs Pvt. Ltd.",
                "Startup / DPIIT Recognized",
                "Clinical Trial Phase II",
                "Novel aqueous extraction at sub-critical temperatures yielding 8% withanolide glycosides without organic solvents, avoiding Section 3(p) TK prior art rejection.",
                "2026-08-14T09:30:00Z",
                "ACTIVE_PENDING",
                "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
            ),
            (
                "AYUSH-REG-2026-0529",
                "Self-Nanoemulsifying Curcuma longa (Turmeric) Formulation with Enhanced Intestinal Lymphatic Uptake",
                "Turmeric (Curcuma longa)",
                "VedicNano Therapeutics",
                "MSME",
                "Pre-Clinical (In-Vivo)",
                "Non-obvious lipid excipient matrix preventing intestinal glucuronidation of curcuminoids without relying on piperine (avoiding Trikatu Section 3(e) prior art).",
                "2026-08-20T14:15:00Z",
                "ACTIVE_PENDING",
                "SHA256:3d4f2b1a89c76e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d"
            ),
            (
                "AYUSH-REG-2026-0681",
                "Enriched Bacoside Fraction of Bacopa monnieri for Attenuation of Neuroinflammation in Early Cognitive Impairment",
                "Brahmi (Bacopa monnieri)",
                "Medhya Bioscience Research Foundation",
                "Academic Research Institute",
                "Formulation & Standardization",
                "Fractionated Bacopaside I and II complex with phospholipid carrier for targeted blood-brain barrier penetration.",
                "2026-08-28T11:45:00Z",
                "ACTIVE_PENDING",
                "SHA256:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
            ),
            (
                "AYUSH-REG-2026-0744",
                "Microencapsulated Ocimum sanctum (Tulsi) Volatile Terpene Inhalation Matrix for Bronchial Hyperreactivity",
                "Tulsi (Ocimum sanctum)",
                "PranaAyur Pharma LLP",
                "Startup",
                "Pre-Clinical",
                "Cyclodextrin complex stabilization of eugenol and caryophyllene preserving anti-inflammatory terpenes in dry powder inhaler delivery.",
                "2026-09-02T16:20:00Z",
                "ACTIVE_PENDING",
                "SHA256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
            )
        ]
        cursor.executemany("""
        INSERT INTO research_registry (
            reg_id, title, herb_name, applicant_name, applicant_type, stage, claims_summary, timestamp, status, security_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, initial_records)
        conn.commit()

    conn.close()

def add_registration(
    title: str,
    herb_name: str,
    applicant_name: str,
    applicant_type: str,
    stage: str,
    claims_summary: str
) -> dict:
    init_registry_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate sequential unique registration ID
    import random
    import hashlib

    cursor.execute("SELECT COUNT(*) as count FROM research_registry")
    count = cursor.fetchone()["count"]
    reg_id = f"AYUSH-REG-2026-{1000 + count + 1:04d}"
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    raw_hash = f"{reg_id}:{title}:{herb_name}:{applicant_name}:{timestamp}"
    security_hash = "SHA256:" + hashlib.sha256(raw_hash.encode("utf-8")).hexdigest()

    cursor.execute("""
    INSERT INTO research_registry (
        reg_id, title, herb_name, applicant_name, applicant_type, stage, claims_summary, timestamp, status, security_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE_PENDING', ?);
    """, (reg_id, title, herb_name, applicant_name, applicant_type, stage, claims_summary, timestamp, security_hash))
    conn.commit()
    conn.close()

    return {
        "reg_id": reg_id,
        "title": title,
        "herb_name": herb_name,
        "applicant_name": applicant_name,
        "applicant_type": applicant_type,
        "stage": stage,
        "claims_summary": claims_summary,
        "timestamp": timestamp,
        "status": "ACTIVE_PENDING",
        "security_hash": security_hash
    }

def get_all_registrations() -> list[dict]:
    init_registry_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM research_registry ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def check_conflicts(query: str, herb_hint: str = None) -> list[dict]:
    """
    Scans the research registry for pending formulations matching query keywords,
    herbs, or biological activities.
    """
    init_registry_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM research_registry WHERE status = 'ACTIVE_PENDING'")
    rows = cursor.fetchall()
    conn.close()

    q_lower = query.lower()
    matches = []

    HERB_SYNONYMS = {
        "ashwagandha": ["ashwagandha", "withania", "somnifera", "asgandh", "indian ginseng"],
        "turmeric": ["turmeric", "haldi", "curcuma", "longa", "curcumin"],
        "neem": ["neem", "nimba", "azadirachta", "indica"],
        "tulsi": ["tulsi", "tulasi", "ocimum", "sanctum", "holy basil"],
        "brahmi": ["brahmi", "bacopa", "monnieri", "medhya", "water hyssop"],
        "guggulu": ["guggulu", "guggul", "commiphora", "mukul"],
        "amla": ["amla", "amalaki", "phyllanthus", "emblica", "gooseberry"],
        "giloy": ["giloy", "guduchi", "tinospora", "cordifolia", "amrita"]
    }

    CONDITION_KEYWORDS = [
        "anxiety", "stress", "sleep", "cortisol", "wound", "inflammation", "joint", "arthritis",
        "memory", "cognitive", "brain", "respiratory", "cough", "asthma", "inhaler", "cholesterol",
        "lipid", "obesity", "dengue", "fever", "antioxidant", "diabetes", "glycemic"
    ]

    for row in rows:
        reg = dict(row)
        title_lower = reg["title"].lower()
        herb_lower = reg["herb_name"].lower()
        claims_lower = reg["claims_summary"].lower()

        is_conflict = False
        reasons = []

        # Check herb overlap
        for canonical_herb, synonyms in HERB_SYNONYMS.items():
            herb_in_query = any(syn in q_lower for syn in synonyms)
            herb_in_reg = any(syn in herb_lower or syn in title_lower for syn in synonyms)
            
            if herb_in_query and herb_in_reg:
                # Herb matches! Now check if there is an overlapping condition/application
                matched_conditions = [kw for kw in CONDITION_KEYWORDS if kw in q_lower and (kw in title_lower or kw in claims_lower)]
                if matched_conditions:
                    is_conflict = True
                    reasons.append(f"Overlap on target herb '{canonical_herb.title()}' and indication '{matched_conditions[0]}'")
                elif any(word in q_lower for word in ["extract", "patent", "formulation", "novel", "carrier"]):
                    # General formulation query on the same registered herb
                    is_conflict = True
                    reasons.append(f"Direct overlap on registered herb '{canonical_herb.title()}'")

        if is_conflict:
            reg["conflict_reason"] = "; ".join(reasons)
            matches.append(reg)

    return matches

# Run initialization once on import
init_registry_db()
