import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.routers.classify import determine_classification

def test_classical_medicine():
    answers = {
        "source_formula": "classical_exact",
        "chemical_fraction": "whole_botanical",
        "intended_use": "medicine",
        "prior_art": "tkdl_present"
    }
    result = determine_classification(answers)
    assert result.classification == "Classical Medicine"
    assert "First Schedule" in result.explanation
    assert "3(p)" in result.explanation

def test_proprietary_medicine():
    answers = {
        "source_formula": "classical_modified",
        "chemical_fraction": "whole_botanical",
        "intended_use": "medicine",
        "prior_art": "tkdl_present"
    }
    result = determine_classification(answers)
    assert result.classification == "Proprietary Medicine"
    assert "Rule 158B" in result.explanation
    assert "National Biodiversity Authority" in result.explanation

def test_phytopharmaceutical():
    answers = {
        "source_formula": "classical_modified",
        "chemical_fraction": "purified_fraction",
        "intended_use": "medicine",
        "prior_art": "tkdl_absent"
    }
    result = determine_classification(answers)
    assert result.classification == "Phytopharmaceutical"
    assert "CDSCO" in result.explanation

def test_new_drug():
    answers = {
        "source_formula": "novel_polyherbal",
        "chemical_fraction": "synthetic_analog",
        "intended_use": "medicine",
        "prior_art": "tkdl_absent"
    }
    result = determine_classification(answers)
    assert result.classification == "New Drug"
    assert "New Drugs and Clinical Trials Rules" in result.explanation

def test_ayurveda_aahar():
    answers = {
        "source_formula": "classical_exact",
        "chemical_fraction": "whole_botanical",
        "intended_use": "food",
        "prior_art": "tkdl_present"
    }
    result = determine_classification(answers)
    assert result.classification == "Ayurveda-Aahar"
    assert "FSSAI" in result.explanation

def test_cosmetic():
    answers = {
        "source_formula": "classical_modified",
        "chemical_fraction": "whole_botanical",
        "intended_use": "cosmetic",
        "prior_art": "tkdl_absent"
    }
    result = determine_classification(answers)
    assert result.classification == "Cosmetic"
    assert "Cosmetic" in result.explanation

if __name__ == "__main__":
    test_classical_medicine()
    test_proprietary_medicine()
    test_phytopharmaceutical()
    test_new_drug()
    test_ayurveda_aahar()
    test_cosmetic()
    print("All 6 Formulation Classification benchmark tests PASSED!")
