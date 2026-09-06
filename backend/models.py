from typing import Literal, Any
from pydantic import BaseModel, Field

class Citation(BaseModel):
    source: str
    ref_id: str
    url: str | None = None

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
