import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/explorer", tags=["Herb & TKDL Explorer"])

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "tkdl_herbs.json"
_herbs_cache = None

def load_herbs():
    global _herbs_cache
    if _herbs_cache is None:
        if DATA_FILE.exists():
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                _herbs_cache = json.load(f)
        else:
            _herbs_cache = []
    return _herbs_cache

@router.get("/all")
async def get_all_herbs():
    """
    Returns the complete catalog of classical Ayurvedic herbs with TKDL and patentability dossiers.
    """
    herbs = load_herbs()
    return {
        "count": len(herbs),
        "herbs": herbs
    }

@router.get("/search")
async def search_herbs(
    q: str = Query(default="", description="Search term for common name, Sanskrit name, scientific name, or bioactive"),
    filter_type: str = Query(default="all", description="Filter: all, 3p, nba, or active")
):
    """
    Fuzzy search across Ayurvedic herbs with TKDL citations and Section 3(p) patent determinations.
    """
    herbs = load_herbs()
    query = q.lower().strip()

    if not query and filter_type == "all":
        return {
            "count": len(herbs),
            "results": herbs
        }

    results = []
    for herb in herbs:
        text_corpus = (
            herb.get("common_name", "") + " " +
            herb.get("sanskrit_name", "") + " " +
            herb.get("scientific_name", "") + " " +
            herb.get("family", "") + " " +
            " ".join(herb.get("key_bioactives", [])) + " " +
            " ".join(herb.get("traditional_uses", []))
        ).lower()

        # Query match
        query_matches = (not query) or (query in text_corpus)

        # Filter type check
        filter_matches = True
        if filter_type == "3p":
            filter_matches = "HIGH_SCRUTINY" in herb.get("patentability_status", {}).get("rating", "") or "STRICT" in herb.get("patentability_status", {}).get("rating", "")
        elif filter_type == "nba":
            filter_matches = "MANDATORY" in herb.get("abs_requirements", {}).get("nba_clearance", "") or "CRITICAL" in herb.get("abs_requirements", {}).get("nba_clearance", "")
        elif filter_type == "active":
            filter_matches = herb.get("active_research_count", 0) > 0

        if query_matches and filter_matches:
            results.append(herb)

    return {
        "count": len(results),
        "results": results
    }

@router.get("/herb/{herb_id}")
async def get_herb_detail(herb_id: str):
    """
    Returns full detailed dossier for a specific botanical compound.
    """
    herbs = load_herbs()
    for herb in herbs:
        if herb["id"].lower() == herb_id.lower():
            return herb
    raise HTTPException(status_code=404, detail=f"Botanical '{herb_id}' not found in TKDL Explorer catalog.")
