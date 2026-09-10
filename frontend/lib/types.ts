export type Jurisdiction = "india" | "international";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface Citation {
  source: string;
  ref_id: string;
  url?: string | null;
}

export type ClassificationType =
  | "Classical Medicine"
  | "Proprietary Medicine"
  | "New Drug"
  | "Phytopharmaceutical"
  | "Ayurveda-Aahar"
  | "Cosmetic";

export interface ClassificationResult {
  classification: ClassificationType;
  explanation: string;
}

export interface ConflictItem {
  reg_id: string;
  title: string;
  herb_name: string;
  applicant_name: string;
  applicant_type: string;
  stage: string;
  timestamp: string;
  conflict_reason: string;
}

export interface ConflictAlert {
  has_conflict: boolean;
  conflict_count: number;
  summary: string;
  conflicts: ConflictItem[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  citations?: Citation[];
  confidence?: ConfidenceLevel;
  jurisdiction?: Jurisdiction;
  disclaimer?: string;
  isRefusal?: boolean;
  timestamp: string;
  conflictAlert?: ConflictAlert | null;
}

export interface ResearchRegistrationRequest {
  title: string;
  herb_name: string;
  applicant_name: string;
  applicant_type: string;
  stage: string;
  claims_summary: string;
}

export interface ResearchRegistration {
  reg_id: string;
  title: string;
  herb_name: string;
  applicant_name: string;
  applicant_type: string;
  stage: string;
  claims_summary: string;
  timestamp: string;
  status: string;
  security_hash: string;
}

export interface PatentabilityStatus {
  rating: string;
  section_3p: string;
  section_3e?: string;
  viable_ip_pathways?: string[];
}

export interface ABSRequirements {
  nba_clearance: string;
  details: string;
  indian_entity_rule?: string;
  punitive_statute?: string;
}

export interface HerbDetail {
  id: string;
  common_name: string;
  sanskrit_name: string;
  scientific_name: string;
  family: string;
  parts_used?: string[];
  classical_texts?: string[];
  traditional_uses: string[];
  tkdl_ref_id: string;
  tkdl_citations?: string[];
  patentability_status: PatentabilityStatus;
  abs_requirements: ABSRequirements;
  key_bioactives: string[];
  active_research_count: number;
}

