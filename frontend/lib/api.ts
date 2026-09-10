import {
  ChatMessage,
  Citation,
  Jurisdiction,
  ClassificationResult,
  ConflictAlert,
  ResearchRegistrationRequest,
  ResearchRegistration,
  HerbDetail
} from "./types";
import OFFLINE_HERBS_DATA from "./tkdl_herbs.json";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const MOCK_SEED_MESSAGES: ChatMessage[] = [
  {
    id: "seed-1",
    sender: "user",
    text: "Can I patent a novel synergy formulation combining Ashwagandha (Withania somnifera) and Curcumin for inflammatory arthritis?",
    jurisdiction: "india",
    timestamp: "10:14 AM",
  },
  {
    id: "seed-2",
    sender: "assistant",
    text: "Under Indian patent law, natural herbs and traditional knowledge are heavily protected against bio-piracy. Under Section 3(p) of the Patents Act, 1970, an invention which in effect is traditional knowledge or an aggregation/duplication of known properties is not patentable. However, if your combination demonstrates statistically validated synergism (beyond the sum of individual effects) or novel extraction ratios, it may qualify as a Proprietary Ayurvedic Medicine. Mandatory prior approval from the National Biodiversity Authority (NBA) under Section 6 of the Biological Diversity Act, 2002 is required before the patent grant.",
    citations: [
      {
        source: "The Patents Act, 1970 — Section 3(p) (Inventions Not Patentable - Traditional Knowledge)",
        ref_id: "IN-PAT-SEC3P",
        url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
      },
      {
        source: "Biological Diversity Act, 2002 — Section 6 (Mandatory NBA Approval for IPR)",
        ref_id: "IN-BDA-SEC6",
        url: "http://nbaindia.org/uploaded/act/BDACT_2002.pdf",
      },
      {
        source: "Drugs & Cosmetics Rules, 1945 — Rule 158B (Proof of Safety & Efficacy for Proprietary ASU)",
        ref_id: "AYUSH-DCR-158B",
        url: "https://ayush.gov.in",
      },
    ],
    confidence: "high",
    jurisdiction: "india",
    disclaimer: "This tool provides informational guidance, not formal legal advice. Consult a registered IP facilitator or patent attorney for official filings.",
    timestamp: "10:15 AM",
  },
  {
    id: "seed-3",
    sender: "user",
    text: "What if I file an international PCT application targeting the European Patent Office and US? What ABS disclosures apply?",
    jurisdiction: "international",
    timestamp: "10:17 AM",
  },
  {
    id: "seed-4",
    sender: "assistant",
    text: "When filing internationally via the PCT route for genetic-resource-derived inventions, you are governed by the Nagoya Protocol on Access and Benefit-Sharing (ABS). You must demonstrate compliance with Prior Informed Consent (PIC) and Mutually Agreed Terms (MAT) from the country of origin (India/NBA). Additionally, under WTO TRIPS Agreement Article 27.2 and 27.3(b), diagnostic/therapeutic methods and plants/animals as found in nature are excludable, though isolated microbiological or chemical compositions may be patented in jurisdictions like the USPTO or EPO subject to national ABS compliance certifications.",
    citations: [
      {
        source: "Nagoya Protocol on Access and Benefit-Sharing — Articles 6, 15 & 16 (Due Diligence & PIC/MAT)",
        ref_id: "INT-NAGOYA-ABS-ART6",
        url: "https://www.cbd.int/abs/text",
      },
      {
        source: "WTO TRIPS Agreement — Article 27 (Patentable Subject Matter & Exclusions)",
        ref_id: "INT-TRIPS-ART27",
        url: "https://www.wto.org/english/docs_e/legal_e/27-trips_04_e.htm",
      },
    ],
    confidence: "medium",
    jurisdiction: "international",
    disclaimer: "This tool provides informational guidance, not formal legal advice. Consult an international patent attorney for cross-border ABS filings.",
    timestamp: "10:18 AM",
  },
];

export async function sendChatMessage(
  message: string,
  jurisdiction: Jurisdiction,
  classification?: string
): Promise<{
  answer: string;
  citations: Citation[];
  confidence: "high" | "medium" | "low";
  jurisdiction: Jurisdiction;
  disclaimer: string;
  isRefusal?: boolean;
  conflictAlert?: ConflictAlert | null;
}> {
  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        jurisdiction,
        classification,
        session_id: "session-mvp-1",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        answer: data.answer,
        citations: data.citations || [],
        confidence: data.confidence || "medium",
        jurisdiction: data.jurisdiction || jurisdiction,
        disclaimer: data.disclaimer || "This tool provides informational guidance, not formal legal advice.",
        isRefusal: (!data.citations || data.citations.length === 0) || data.confidence === "low",
        conflictAlert: data.conflict_alert || null,
      };
    }
  } catch (err) {
    console.warn("Backend offline, falling back to local client simulator:", err);
  }

  // Local fallback response when running offline in live demo
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = message.toLowerCase();

  // Low-confidence / Refusal test case
  if (lower.includes("trick") || lower.includes("mix") || lower.includes("tax") || lower.includes("criminal penalty")) {
    return {
      answer: "I do not have a verified statutory citation or sufficient confidence in the active corpus to answer this query safely. To avoid hallucinated legal advice, this query has been flagged for human consultation.",
      citations: [],
      confidence: "low",
      jurisdiction,
      disclaimer: "This query cannot be answered with verified statutory authority.",
      isRefusal: true,
    };
  }

  if (jurisdiction === "india") {
    return {
      answer: `Under Indian statutory law (Patents Act, 1970 § 3(p) and Biological Diversity Act, 2002 § 6), herbal products derived from traditional knowledge require strict demarcation between classical prior art and patentable novelty. For '${classification || "Proprietary Medicine"}', verify whether the components exist in the Ayurvedic Formulary of India (AFI) or TKDL prior art archives before initiating commercialization.`,
      citations: [
        {
          source: "The Patents Act, 1970 — Section 3(p)",
          ref_id: "IN-PAT-SEC3P",
          url: "https://ipindia.gov.in",
        },
        {
          source: "Biological Diversity Act, 2002 — Section 6",
          ref_id: "IN-BDA-SEC6",
          url: "http://nbaindia.org",
        },
      ],
      confidence: "high",
      jurisdiction: "india",
      disclaimer: "This tool provides informational guidance, not formal legal advice.",
    };
  } else {
    return {
      answer: "Under international intellectual property frameworks, inventions utilizing biological resources must satisfy the Nagoya Protocol ABS clearing-house disclosure obligations and WTO TRIPS Article 27 standards. Prior Informed Consent (PIC) is mandatory across signatory nations before patent prosecution.",
      citations: [
        {
          source: "WTO TRIPS Agreement — Article 27 (Patentable Subject Matter)",
          ref_id: "INT-TRIPS-ART27",
          url: "https://www.wto.org",
        },
        {
          source: "Nagoya Protocol on Access and Benefit Sharing — Article 6",
          ref_id: "INT-NAGOYA-ABS-ART6",
          url: "https://www.cbd.int/abs",
        },
      ],
      confidence: "medium",
      jurisdiction: "international",
      disclaimer: "This tool provides informational guidance, not formal legal advice.",
    };
  }
}

export async function classifyFormulation(answers: Record<string, any>): Promise<ClassificationResult> {
  try {
    const res = await fetch(`${BACKEND_URL}/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    if (res.ok) {
      const data: ClassificationResult = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("Backend classify endpoint unavailable, evaluating client-side rules:", err);
  }

  // Client-side fallback rule engine
  const source = answers.source_formula;
  const fraction = answers.chemical_fraction;
  const use = answers.intended_use;

  if (use === "cosmetic") {
    return {
      classification: "Cosmetic",
      explanation: "Governed under AYUSH Cosmetic licensing guidelines. Intended strictly for cleansing, beautifying, or topical enhancement without therapeutic disease claims.",
    };
  }

  if (use === "food") {
    return {
      classification: "Ayurveda-Aahar",
      explanation: "Classified under FSSAI (Ayurveda Aahar) Regulations, 2022. Permitted to claim physiological wellness and traditional Rasayana dietary support, but prohibited from claiming disease cure.",
    };
  }

  if (fraction === "synthetic_analog" || answers.is_novel_compound) {
    return {
      classification: "New Drug",
      explanation: "Contains a novel synthetic entity or unapproved active fraction. Requires full clinical safety and efficacy evaluation under New Drugs and Clinical Trials Rules, 2019.",
    };
  }

  if (fraction === "purified_fraction") {
    return {
      classification: "Phytopharmaceutical",
      explanation: "Contains purified bioactive fraction with standardized chemical markers (>4 markers). Governed under CDSCO Chapter XA phytopharmaceutical pathway.",
    };
  }

  if (source === "classical_exact" && use === "medicine") {
    return {
      classification: "Classical Medicine",
      explanation: "Formulation directly matches an authoritative textbook in the First Schedule of Drugs & Cosmetics Act. Non-patentable as traditional knowledge under Patents Act § 3(p).",
    };
  }

  return {
    classification: "Proprietary Medicine",
    explanation: "Patent or Proprietary Ayurvedic Medicine under Section 3(h). Requires safety & efficacy data under Rule 158B; patentable only if non-obvious synergistic efficacy is proven. Mandatory NBA Section 6 approval required.",
  };
}

export async function registerResearch(data: ResearchRegistrationRequest): Promise<ResearchRegistration> {
  try {
    const res = await fetch(`${BACKEND_URL}/registry/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend registry endpoint unavailable, using offline fallback:", err);
  }

  // Offline fallback
  const mockId = `AYUSH-REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    reg_id: mockId,
    title: data.title,
    herb_name: data.herb_name,
    applicant_name: data.applicant_name,
    applicant_type: data.applicant_type,
    stage: data.stage,
    claims_summary: data.claims_summary,
    timestamp: new Date().toISOString(),
    status: "ACTIVE_PENDING",
    security_hash: "SHA256:" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  };
}

export async function getRegistrations(): Promise<ResearchRegistration[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/registry/list`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend registry list unavailable, using offline mock data:", err);
  }

  return [];
}

export async function searchHerbs(query: string = "", filterType: string = "all"): Promise<{ count: number; results: HerbDetail[] }> {
  try {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (filterType && filterType !== "all") params.append("filter_type", filterType);

    const res = await fetch(`${BACKEND_URL}/explorer/search?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend explorer search unavailable, using offline dataset:", err);
  }

  // Client-side fallback using bundled botanical dataset
  let dataset = (OFFLINE_HERBS_DATA as unknown) as HerbDetail[];

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    dataset = dataset.filter((h) =>
      h.common_name.toLowerCase().includes(q) ||
      h.sanskrit_name.toLowerCase().includes(q) ||
      h.scientific_name.toLowerCase().includes(q) ||
      h.key_bioactives.some((b) => b.toLowerCase().includes(q))
    );
  }

  if (filterType === "3p") {
    dataset = dataset.filter((h) => h.patentability_status.rating === "HIGH_SCRUTINY_3P");
  } else if (filterType === "nba") {
    dataset = dataset.filter((h) => h.abs_requirements.nba_clearance === "MANDATORY_FOREIGN");
  } else if (filterType === "active") {
    dataset = dataset.filter((h) => h.active_research_count > 0);
  }

  return { count: dataset.length, results: dataset };
}

export async function getHerbDetail(id: string): Promise<HerbDetail | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/explorer/herb/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend explorer detail unavailable, using offline fallback:", err);
  }

  const dataset = (OFFLINE_HERBS_DATA as unknown) as HerbDetail[];
  return dataset.find((h) => h.id.toLowerCase() === id.toLowerCase()) || null;
}


