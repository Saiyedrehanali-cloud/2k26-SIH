from typing import Literal, Any
from pydantic import BaseModel, Field

class Citation(BaseModel):
    source: str
    ref_id: str
    url: str | None = None

class ConflictItem(BaseModel):
    reg_id: str
    title: str
    herb_name: str
    applicant_name: str
    applicant_type: str
    stage: str
    timestamp: str
    conflict_reason: str

class ConflictAlert(BaseModel):
    has_conflict: bool
    conflict_count: int
    summary: str
    conflicts: list[ConflictItem] = Field(default_factory=list)

class ChatRequest(BaseModel):
    message: str
    jurisdiction: Literal["india", "international"] = "india"
    classification: str | None = None
    session_id: str | None = None

class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation] = Field(default_factory=list)
    confidence: Literal["high", "medium", "low"]
    jurisdiction: Literal["india", "international"]
    disclaimer: str = "This tool provides informational guidance, not formal legal advice. Consult a registered IP facilitator or patent attorney for official filings."
    conflict_alert: ConflictAlert | None = None

class ResearchRegistrationRequest(BaseModel):
    title: str
    herb_name: str
    applicant_name: str
    applicant_type: str = "Startup"
    stage: str = "Formulation & Standardization"
    claims_summary: str

class ResearchRegistrationResponse(BaseModel):
    reg_id: str
    title: str
    herb_name: str
    applicant_name: str
    applicant_type: str
    stage: str
    claims_summary: str
    timestamp: str
    status: str
    security_hash: str

class ClassificationRequest(BaseModel):
    answers: dict[str, Any]

class ClassificationResult(BaseModel):
    classification: Literal[
        "Classical Medicine",
        "Proprietary Medicine",
        "New Drug",
        "Phytopharmaceutical",
        "Ayurveda-Aahar",
        "Cosmetic"
    ]
    explanation: str
