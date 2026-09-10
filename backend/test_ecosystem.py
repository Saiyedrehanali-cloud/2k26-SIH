import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_ecosystem():
    print("Testing /health...")
    r = client.get("/health")
    assert r.status_code == 200
    print("Health OK:", r.json())

    print("\nTesting /explorer/all...")
    r = client.get("/explorer/all")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] >= 8
    print(f"Explorer All OK: Loaded {data['count']} classical herbs.")

    print("\nTesting /explorer/search?q=ashwagandha...")
    r = client.get("/explorer/search?q=ashwagandha")
    assert r.status_code == 200
    results = r.json()["results"]
    assert len(results) > 0
    assert "Withania" in results[0]["scientific_name"]
    print(f"Search OK: Found {results[0]['common_name']} ({results[0]['tkdl_ref_id']})")

    print("\nTesting /registry/list...")
    r = client.get("/registry/list")
    assert r.status_code == 200
    records = r.json()
    assert len(records) >= 4
    print(f"Registry List OK: Found {len(records)} pending registrations.")

    print("\nTesting /registry/add...")
    payload = {
        "title": "Aqueous Extract of Curcuma longa with Liposomal Carrier for Osteoarthritis",
        "herb_name": "Turmeric (Curcuma longa)",
        "applicant_name": "BioAyur Innovations Ltd",
        "applicant_type": "Startup",
        "stage": "Formulation & Standardization",
        "claims_summary": "Sub-micron phospholipid vesicle formulation with stabilized curcumoids avoiding glucuronidation."
    }
    r = client.post("/registry/add", json=payload)
    assert r.status_code == 200
    new_reg = r.json()
    assert "AYUSH-REG-2026-" in new_reg["reg_id"]
    print("Registry Add OK: Created", new_reg["reg_id"], new_reg["security_hash"][:25] + "...")

    print("\nTesting /chat with conflict trigger on Ashwagandha anxiety...")
    chat_payload = {
        "message": "Can I patent an aqueous extract of Ashwagandha for treating anxiety?",
        "jurisdiction": "india"
    }
    r = client.post("/chat", json=chat_payload)
    assert r.status_code == 200
    chat_resp = r.json()
    assert chat_resp["conflict_alert"] is not None
    assert chat_resp["conflict_alert"]["has_conflict"] is True
    print(f"Chat Conflict Alert OK: {chat_resp['conflict_alert']['summary']}")
    for c in chat_resp["conflict_alert"]["conflicts"]:
        print(f" -> Found Conflict: {c['reg_id']} by {c['applicant_name']} ({c['conflict_reason']})")

    print("\n ALL BACKEND ECOSYSTEM TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_ecosystem()
