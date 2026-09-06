"""
RAG Ingestion Pipeline for IP-SAKTI Sahayak (Ministry of Ayush)
Splits seeded legal documents on section/article boundaries and embeds into local Chroma DB
with strict jurisdiction metadata ('india' or 'international').
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Any
import chromadb
from chromadb.config import Settings

DEFAULT_RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"
DEFAULT_PERSIST_DIR = Path(__file__).resolve().parent.parent / "data" / "chroma_db"
COLLECTION_NAME = "ayush_legal_corpus"


def parse_document_sections(file_path: Path, doc_meta: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Parses a statutory document and splits it by section boundaries (marked by '---').
    Each section is enriched with statutory context and metadata for precise RAG citation.
    """
    text = file_path.read_text(encoding="utf-8")
    
    # Extract header block if present
    header_match = re.search(r"={10,}\s*([\s\S]*?)\s*={10,}", text)
    header_context = ""
    body_text = text
    if header_match:
        header_context = header_match.group(1).strip()
        body_text = text[header_match.end():].strip()

    # Split on markdown/text horizontal dividers (---)
    raw_sections = [s.strip() for s in re.split(r"\n\s*---\s*\n", body_text) if s.strip()]
    
    chunks = []
    for idx, section in enumerate(raw_sections):
        lines = [line.strip() for line in section.split("\n") if line.strip()]
        if not lines:
            continue
            
        # Determine specific section reference from top line or section heading
        first_line = lines[0]
        section_ref = first_line
        # Look for patterns like SECTION 3(p), RULE 158B, ARTICLE 27, etc.
        sec_match = re.search(r"(SECTION\s+[0-9A-Za-z\(\)]+|RULE\s+[0-9A-Za-z]+|ARTICLE\s+[0-9A-Za-z\.]+|GUIDELINE|SCHEDULE)", section, re.IGNORECASE)
        if sec_match:
            # Try to grab the full line or bracketed heading
            for line in lines[:3]:
                if sec_match.group(0).lower() in line.lower():
                    section_ref = line.strip("[]: ")
                    break

        # Compose enriched content for vector embedding
        enriched_content = (
            f"DOCUMENT: {doc_meta['title']}\n"
            f"JURISDICTION: {doc_meta['jurisdiction'].upper()}\n"
            f"AUTHORITY: {doc_meta['authority']}\n"
            f"SECTION: {section_ref}\n"
            f"OFFICIAL URL: {doc_meta['official_url']}\n\n"
            f"STATUTORY TEXT:\n{section}"
        )

        chunk_id = f"{doc_meta['id']}_sec_{idx + 1}"
        
        chunks.append({
            "id": chunk_id,
            "text": enriched_content,
            "metadata": {
                "doc_id": doc_meta["id"],
                "jurisdiction": doc_meta["jurisdiction"],
                "title": doc_meta["title"],
                "authority": doc_meta["authority"],
                "section_ref": section_ref[:200],
                "url": doc_meta["official_url"]
            }
        })
        
    return chunks


def ingest_documents(raw_dir: Path = DEFAULT_RAW_DIR, persist_dir: Path = DEFAULT_PERSIST_DIR) -> Dict[str, Any]:
    """
    Ingests all documents listed in manifest.json into the persistent Chroma DB collection.
    """
    raw_dir = Path(raw_dir)
    persist_dir = Path(persist_dir)
    manifest_path = raw_dir / "manifest.json"
    
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found at {manifest_path}")

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # Initialize Chroma persistent client
    persist_dir.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(persist_dir))
    
    # Get or create collection
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Authenticated statutory texts for Ayush legal intelligence"}
    )

    all_ids = []
    all_documents = []
    all_metadatas = []
    
    stats = {"india": 0, "international": 0, "total_chunks": 0, "documents_indexed": []}

    print(f"[Ingest] Starting ingestion from {raw_dir} into ChromaDB at {persist_dir}...")

    for doc in manifest.get("documents", []):
        file_path = raw_dir / doc["filename"]
        if not file_path.exists():
            print(f"[Ingest WARNING] File {file_path} not found, skipping.")
            continue

        chunks = parse_document_sections(file_path, doc)
        print(f"[Ingest] Processed {doc['id']} ({doc['filename']}): {len(chunks)} section chunks.")

        for chunk in chunks:
            all_ids.append(chunk["id"])
            all_documents.append(chunk["text"])
            all_metadatas.append(chunk["metadata"])
            
            jurisdiction = chunk["metadata"]["jurisdiction"]
            stats[jurisdiction] = stats.get(jurisdiction, 0) + 1

        stats["documents_indexed"].append({
            "id": doc["id"],
            "title": doc["title"],
            "chunks": len(chunks)
        })

    if all_ids:
        # Upsert into Chroma
        collection.upsert(
            ids=all_ids,
            documents=all_documents,
            metadatas=all_metadatas
        )
        stats["total_chunks"] = len(all_ids)
        print(f"[Ingest SUCCESS] Successfully indexed {len(all_ids)} chunks into '{COLLECTION_NAME}'.")
        print(f"  - India chunks: {stats['india']}")
        print(f"  - International chunks: {stats['international']}")

    return stats


if __name__ == "__main__":
    result = ingest_documents()
    print("\nIngestion Summary:", json.dumps(result, indent=2))
