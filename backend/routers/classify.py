from typing import Any
from fastapi import APIRouter
from backend.models import ClassificationRequest, ClassificationResult

router = APIRouter(prefix="", tags=["Classification"])

def determine_classification(answers: dict[str, Any]) -> ClassificationResult:
    """
    Deterministic rule-based classification of Ayurvedic and botanical formulations
    under the Drugs & Cosmetics Act (1940), Rules (1945), Patents Act (1970),
    and FSSAI (Ayurveda Aahar) Regulations (2022).
    """
    source_formula = answers.get("source_formula", "")
    fraction_type = answers.get("chemical_fraction", "")
    intended_use = answers.get("intended_use", "")
    tkdl_status = answers.get("prior_art", "")
    
    # Also support boolean legacy keys if sent:
    is_traditional = answers.get("is_traditional_formula", False) or source_formula == "classical_exact"
    is_novel_compound = answers.get("is_novel_compound", False) or fraction_type == "synthetic_analog"
    is_purified_phytochemical = answers.get("is_phytopharmaceutical", False) or fraction_type == "purified_fraction"
    use = intended_use or answers.get("intended_use", "medicine")

    # 1. Cosmetic Classification
    if use == "cosmetic":
        return ClassificationResult(
            classification="Cosmetic",
            explanation=(
                "Governed under AYUSH Cosmetic licensing guidelines and Drugs & Cosmetics Rules. "
                "Intended strictly for cleansing, beautifying, or topical enhancement without medicinal "
                "or therapeutic claims on packaging."
            )
        )

    # 2. Ayurveda-Aahar (Food/Dietary) Classification
    if use == "food" or use == "dietary_supplement":
        return ClassificationResult(
            classification="Ayurveda-Aahar",
            explanation=(
                "Classified under FSSAI (Ayurveda Aahar) Regulations, 2022. Permitted to claim physiological "
                "balance, general wellness, and Rasayana support; strictly prohibited from claiming disease cure "
                "or therapeutic intervention."
            )
        )

    # 3. New Drug Classification (Synthetic analogs, novel NCEs)
    if is_novel_compound or fraction_type == "synthetic_analog":
        return ClassificationResult(
            classification="New Drug",
            explanation=(
                "Contains a new chemical entity (NCE) or synthetic modification not recognized in ASU pharmacopoeia. "
                "Governed under the New Drugs and Clinical Trials Rules, 2019, requiring rigorous Phase 1 to 3 "
                "clinical trials under CDSCO."
            )
        )

    # 4. Phytopharmaceutical Drug Classification
    if is_purified_phytochemical or fraction_type == "purified_fraction":
        return ClassificationResult(
            classification="Phytopharmaceutical",
            explanation=(
                "Purified bioactive fraction or standardized botanical extract (minimum 4 bioactive markers). "
                "Regulated under CDSCO Chapter XA phytopharmaceutical pathway, requiring standardized preclinical "
                "and clinical safety dossier."
            )
        )

    # 5. Classical Medicine Classification
    if is_traditional and source_formula == "classical_exact" and use == "medicine":
        return ClassificationResult(
            classification="Classical Medicine",
            explanation=(
                "Formulation matches an authoritative textbook in the First Schedule of the Drugs & Cosmetics Act. "
                "Non-patentable as traditional knowledge under Patents Act § 3(p); eligible for manufacturing "
                "license without full clinical trial data."
            )
        )

    # 6. Proprietary Medicine Classification (Default for ASU therapeutic innovations)
    explanation_parts = [
        "Patent or Proprietary Ayurvedic Medicine under Section 3(h) of Drugs & Cosmetics Act."
    ]
    if source_formula == "classical_modified" or source_formula == "novel_polyherbal":
        explanation_parts.append(
            "Requires safety & efficacy data under Rule 158B. Patentable only if non-obvious synergistic efficacy "
            "is proven to overcome Section 3(p) exclusions."
        )
    if tkdl_status == "tkdl_present":
        explanation_parts.append(
            "Documented prior art exists in TKDL; patent claims must demonstrate surprising technical synergy."
        )
    explanation_parts.append(
        "Mandatory prior clearance from National Biodiversity Authority (NBA) under Section 6 of Biological Diversity Act required."
    )

    return ClassificationResult(
        classification="Proprietary Medicine",
        explanation=" ".join(explanation_parts)
    )

@router.post("/classify", response_model=ClassificationResult)
async def classify_endpoint(request: ClassificationRequest) -> ClassificationResult:
    """
    Deterministic rule-based classifier endpoint for Ayurvedic formulations.
    Evaluates 4-6 parameters and maps to one of the 6 statutory categories.
    """
    return determine_classification(request.answers)
