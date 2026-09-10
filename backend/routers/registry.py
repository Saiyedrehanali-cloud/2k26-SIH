from fastapi import APIRouter, HTTPException, Query
from backend.models import (
    ResearchRegistrationRequest,
    ResearchRegistrationResponse,
    ConflictAlert,
    ConflictItem
)
from backend.registry_db import (
    add_registration,
    get_all_registrations,
    check_conflicts
)

router = APIRouter(prefix="/registry", tags=["Innovation Registry"])

@router.post("/add", response_model=ResearchRegistrationResponse)
async def register_research_endpoint(request: ResearchRegistrationRequest) -> ResearchRegistrationResponse:
    """
    Pre-register an ongoing formulation research project or extraction claim
    in the secure Innovation Registry ledger.
    """
    if not request.title.strip() or not request.herb_name.strip():
        raise HTTPException(status_code=400, detail="Title and target herb name are required.")

    result = add_registration(
        title=request.title.strip(),
        herb_name=request.herb_name.strip(),
        applicant_name=request.applicant_name.strip(),
        applicant_type=request.applicant_type.strip(),
        stage=request.stage.strip(),
        claims_summary=request.claims_summary.strip()
    )
    return ResearchRegistrationResponse(**result)

@router.get("/list", response_model=list[ResearchRegistrationResponse])
async def list_registrations_endpoint() -> list[ResearchRegistrationResponse]:
    """
    List all pre-registered innovation records from the SQLite ledger.
    """
    records = get_all_registrations()
    return [ResearchRegistrationResponse(**r) for r in records]

@router.get("/check", response_model=ConflictAlert)
async def check_conflicts_endpoint(q: str = Query(..., description="Query or compound text to scan for conflicts")) -> ConflictAlert:
    """
    Fast scanning endpoint to check if similar research is pending prior art.
    """
    conflicts = check_conflicts(q)
    has_conflict = len(conflicts) > 0
    items = [
        ConflictItem(
            reg_id=c["reg_id"],
            title=c["title"],
            herb_name=c["herb_name"],
            applicant_name=c["applicant_name"],
            applicant_type=c["applicant_type"],
            stage=c["stage"],
            timestamp=c["timestamp"],
            conflict_reason=c.get("conflict_reason", "Keyword/botanical overlap")
        )
        for c in conflicts
    ]
    summary = (
        f"Conflict Alert: {len(items)} pending research registration(s) detected matching your query parameters."
        if has_conflict
        else "No active pre-registration conflicts detected in the ledger."
    )
    return ConflictAlert(
        has_conflict=has_conflict,
        conflict_count=len(items),
        summary=summary,
        conflicts=items
    )
