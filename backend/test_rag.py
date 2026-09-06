"""
Comprehensive Test Suite for Live RAG Pipeline (IP-SAKTI Sahayak)
Tests:
1. Retrieval of authentic statutory texts from ChromaDB.
2. Indian jurisdiction questions (Patents Act Section 3(p), Rule 158B, NBA Sec 6).
3. International jurisdiction questions (TRIPS Art 27, Nagoya Protocol).
4. Jurisdiction isolation (Cross-jurisdiction trick question rejection).
5. Low confidence refusal guardrail.
"""

import sys
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi.testclient import TestClient
from backend.main import app
from backend.rag.retrieve import retrieve_chunks

client = TestClient(app)


def test_chroma_retrieval_direct():
    print("\n[Test 1] Direct Vector Retrieval:")
    chunks = retrieve_chunks("Can I patent an Ashwagandha traditional formulation?", jurisdiction="india", top_k=2)
    assert len(chunks) > 0, "Expected at least 1 chunk retrieved"
    first_chunk = chunks[0]
    print(f"  Top chunk doc: {first_chunk['metadata']['title']}")
    print(f"  Top chunk section: {first_chunk['metadata']['section_ref']}")
    assert first_chunk["metadata"]["jurisdiction"] == "india", "Jurisdiction filter failed!"
    print("  --> PASS: Direct vector retrieval succeeds with exact jurisdiction filter.")


def test_indian_chat_query():
    print("\n[Test 2] POST /chat (Indian Jurisdiction):")
    payload = {
        "message": "Can I patent an Ashwagandha traditional formulation under Indian patent law?",
        "jurisdiction": "india",
        "classification": "Proprietary Medicine"
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print("  Confidence:", data["confidence"])
    print("  Citations count:", len(data["citations"]))
    for c in data["citations"]:
        print(f"    - {c['source']} ({c['ref_id']}) -> {c['url']}")
    assert len(data["citations"]) > 0, "Expected citations to be populated"
    assert data["jurisdiction"] == "india"
    print("  --> PASS: Indian chat endpoint returns grounded statutory answer with citations.")


def test_international_chat_query():
    print("\n[Test 3] POST /chat (International Jurisdiction):")
    payload = {
        "message": "What are the rules regarding patent exclusions for plant varieties and genetic resources under WTO TRIPS?",
        "jurisdiction": "international"
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    print("  Confidence:", data["confidence"])
    print("  Citations count:", len(data["citations"]))
    for c in data["citations"]:
        print(f"    - {c['source']} ({c['ref_id']})")
    assert any("TRIPS" in c["source"] or "Nagoya" in c["source"] for c in data["citations"]), "Expected international treaties in citations"
    assert data["jurisdiction"] == "international"
    print("  --> PASS: International chat endpoint returns TRIPS/Nagoya grounded citations.")


def test_cross_jurisdiction_trick_question():
    print("\n[Test 4] Cross-jurisdiction Trick Question:")
    # Asking Nagoya Protocol in Indian jurisdiction:
    chunks = retrieve_chunks("What are the provisions of Nagoya Protocol on ABS?", jurisdiction="india", top_k=3)
    # Confirm none of the chunks returned have jurisdiction="international"
    for c in chunks:
        assert c["metadata"]["jurisdiction"] == "india", "Cross-jurisdiction leak detected!"
    print("  --> PASS: Zero cross-jurisdiction leakage in vector retrieval.")


def test_out_of_domain_refusal():
    print("\n[Test 5] Out-of-domain Refusal Guardrail:")
    payload = {
        "message": "How do I bake a chocolate cake at home?",
        "jurisdiction": "india"
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    print("  Refusal state:", data.get("refusal"))
    print("  Confidence:", data["confidence"])
    assert data["confidence"] == "low" or data.get("refusal") is True, "Expected low confidence or refusal for out-of-domain query"
    print("  --> PASS: Refusal guardrail triggered for out-of-scope query.")


if __name__ == "__main__":
    test_chroma_retrieval_direct()
    test_indian_chat_query()
    test_international_chat_query()
    test_cross_jurisdiction_trick_question()
    test_out_of_domain_refusal()
    print("\n=======================================================")
    print(" ALL PHASE 3 RAG & GUARDRAIL TESTS PASSED SUCCESSFULLY!")
    print("=======================================================\n")
