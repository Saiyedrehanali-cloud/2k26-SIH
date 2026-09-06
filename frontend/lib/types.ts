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
}
