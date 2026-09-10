import { Citation, Jurisdiction, ConflictAlert } from "./types";
import OFFLINE_HERBS_DATA from "./tkdl_herbs.json";

export interface LegalRagResponse {
  answer: string;
  citations: Citation[];
  confidence: "high" | "medium" | "low";
  jurisdiction: Jurisdiction;
  disclaimer: string;
  isRefusal?: boolean;
  conflictAlert?: ConflictAlert | null;
}

interface StatutoryRecord {
  keywords: string[];
  jurisdiction: Jurisdiction | "all";
  answer: string;
  citations: Citation[];
  confidence: "high" | "medium";
}

const STATUTORY_KNOWLEDGE_BASE: StatutoryRecord[] = [
  {
    keywords: ["ashwagandha", "withania", "arthritis", "anti-inflammatory", "curcumin", "turmeric"],
    jurisdiction: "india",
    answer: "Under Section 3(p) of the Indian Patents Act, 1970, inventions that are traditional knowledge or aggregations/duplications of known properties of traditionally known components are strictly excluded from patentability. However, polyherbal formulations may overcome this barrier if you provide empirical, statistically validated synergism under Section 3(e) demonstrating that the combination bioactivity exceeds the sum of individual components. In addition, mandatory Form III approval from the National Biodiversity Authority (NBA) under Section 6 of the Biological Diversity Act, 2002 is required before the patent grant.",
    citations: [
      {
        source: "The Patents Act, 1970 — Section 3(p) (Traditional Knowledge Exclusions)",
        ref_id: "IN-PAT-1970-SEC3P",
        url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
      },
      {
        source: "The Patents Act, 1970 — Section 3(e) (Admixtures & Synergism Requirement)",
        ref_id: "IN-PAT-1970-SEC3E",
        url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
      },
      {
        source: "Biological Diversity Act, 2002 — Section 6 (Mandatory NBA Approval for IPR)",
        ref_id: "IN-BDA-2002-SEC6",
        url: "http://nbaindia.org/uploaded/act/BDACT_2002.pdf",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["nba", "biodiversity", "form iii", "national biodiversity authority", "sbb", "biological diversity"],
    jurisdiction: "india",
    answer: "Under Section 6(1) of the Biological Diversity Act, 2002, no person shall apply for any intellectual property right, in or outside India, for any invention based on research or information on a biological resource obtained from India without previous approval of the National Biodiversity Authority (Form III). Section 6(2) empowers the NBA to impose equitable benefit-sharing terms. Furthermore, under Section 10(4)(d)(ii) of the Patents Act, 1970, disclosing the exact Indian geographical origin of the biological resource is mandatory, and non-disclosure constitutes statutory grounds for patent revocation under Section 64.",
    citations: [
      {
        source: "Biological Diversity Act, 2002 — Section 6 (Approval for IPR Applications)",
        ref_id: "IN-BDA-2002-SEC6",
        url: "http://nbaindia.org/uploaded/act/BDACT_2002.pdf",
      },
      {
        source: "Biological Diversity Act, 2002 — Section 21 (Equitable Benefit Sharing)",
        ref_id: "IN-BDA-2002-SEC21",
        url: "http://nbaindia.org/uploaded/act/BDACT_2002.pdf",
      },
      {
        source: "The Patents Act, 1970 — Section 10(4)(d)(ii) (Mandatory Source Disclosure)",
        ref_id: "IN-PAT-1970-SEC10",
        url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["rule 158b", "proprietary", "licensing", "158b", "asu", "drugs and cosmetics"],
    jurisdiction: "india",
    answer: "Under Rule 158B of the Drugs and Cosmetics Rules, 1945, Patent or Proprietary Ayurvedic, Siddha, or Unani (ASU) medicines require differentiated evidence for licensing: (1) Category I formulations with minor classical excipients require published literature evidence; (2) Category II combinations with new ratios require acute toxicity (LD50) safety data and pilot clinical effectiveness documentation; (3) Category III purified phytochemical fractions require full clinical validation under CDSCO Chapter XA phytopharmaceutical guidelines.",
    citations: [
      {
        source: "Drugs and Cosmetics Rules, 1945 — Rule 158B (Issue of License for ASU Formulations)",
        ref_id: "IN-DCR-1945-RULE158B",
        url: "https://ayush.gov.in",
      },
      {
        source: "Drugs and Cosmetics Act, 1940 — Section 3(h) (Patent or Proprietary ASU Definition)",
        ref_id: "IN-DCA-1940-SEC3H",
        url: "https://ayush.gov.in",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["tkdl", "traditional knowledge digital library", "prior art", "biopiracy", "turmeric", "neem"],
    jurisdiction: "all",
    answer: "The Traditional Knowledge Digital Library (TKDL), established jointly by CSIR and the Ministry of Ayush, digitizes classical formulations from Charaka Samhita, Sushruta Samhita, and AFI into international patent classifications (IPC) in 5 global languages. TKDL access agreements allow global patent offices (USPTO, EPO, JPO) to identify traditional prior art during examination. Under Section 25(1)(k) of the Patents Act, 1970, anticipation by traditional knowledge constitutes an absolute pre-grant opposition ground, establishing precedent from landmark revocations like Turmeric (US5401504) and Neem (EP0436257).",
    citations: [
      {
        source: "Traditional Knowledge Digital Library (TKDL) Prior Art Guidelines",
        ref_id: "IN-TKDL-GUIDELINES",
        url: "https://www.tkdl.res.in",
      },
      {
        source: "The Patents Act, 1970 — Section 25(1)(k) (Opposition via Traditional Knowledge)",
        ref_id: "IN-PAT-1970-SEC25",
        url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["section 3(p)", "section 3p", "traditional knowledge", "patentable", "patentability", "plant"],
    jurisdiction: "india",
    answer: "Section 3(p) of the Patents Act, 1970 explicitly states that 'an invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components' is not an invention. To build a valid patent claim, applicants must demonstrate a significant technological advance such as novel non-obvious modified molecular scaffolds, standardized bioavailability-enhancing targeted delivery vectors, or non-trivial synergistic pharmacological actions.",
    citations: [
      {
        source: "The Patents Act, 1970 — Section 3(p) (Statutory Non-Patentable Exclusions)",
        ref_id: "IN-PAT-1970-SEC3P",
        url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
      },
      {
        source: "Indian Patent Office Guidelines for Examination of Biotechnology Inventions",
        ref_id: "IPO-BIO-EXAM-GUIDELINES",
        url: "https://ipindia.gov.in",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["nagoya", "abs", "pct", "international", "access and benefit", "pic", "mat"],
    jurisdiction: "international",
    answer: "Under Articles 5, 6, 7, and 15 of the Nagoya Protocol on Access and Benefit-Sharing (ABS), international patent filings (via PCT or national phase) utilizing genetic resources must comply with ABS disclosure standards. Applicants must demonstrate Prior Informed Consent (PIC) from the indigenous provider country and execution of Mutually Agreed Terms (MAT). When filing in the European Patent Office (EPO) or USPTO, origin disclosure certifications must be documented through the ABS Clearing-House (ABSCH).",
    citations: [
      {
        source: "Nagoya Protocol on Access and Benefit-Sharing — Articles 6 & 15 (PIC and Compliance)",
        ref_id: "INT-NAGOYA-ABS-ART6",
        url: "https://www.cbd.int/abs/text/",
      },
      {
        source: "Convention on Biological Diversity (CBD) — Access & Benefit Sharing Clearing-House",
        ref_id: "INT-CBD-ABSCH",
        url: "https://absch.cbd.int",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["trips", "wto", "article 27", "exclusions", "wto trips"],
    jurisdiction: "international",
    answer: "Under Article 27.2 of the WTO TRIPS Agreement, member countries may exclude from patentability inventions contrary to ordre public or morality, including to protect human, animal, or plant life. Article 27.3(a) allows exclusion of diagnostic, therapeutic, and surgical methods. Article 27.3(b) permits exclusion of plants and animals other than microorganisms, while requiring protection of plant varieties either through patents or an effective sui generis system.",
    citations: [
      {
        source: "WTO TRIPS Agreement — Article 27.2 (Public Health & Morality Exclusions)",
        ref_id: "INT-TRIPS-1994-ART272",
        url: "https://www.wto.org/english/docs_e/legal_e/27-trips_04_e.htm",
      },
      {
        source: "WTO TRIPS Agreement — Article 27.3(b) (Plant Varieties & Sui Generis Systems)",
        ref_id: "INT-TRIPS-1994-ART273B",
        url: "https://www.wto.org/english/docs_e/legal_e/27-trips_04_e.htm",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["epo", "european patent", "article 54", "novelty", "europe"],
    jurisdiction: "international",
    answer: "Under Article 54 of the European Patent Convention (EPC), traditional medicinal knowledge published in TKDL or ancient textbooks constitutes state of the art worldwide. An herbal formulation will be rejected for lack of novelty unless the applicant claims a specific newly discovered medical use under EPC Article 54(5) ('Second Medical Indication') or demonstrates an unexpected, non-obvious synergistic composition validated by empirical comparative assays.",
    citations: [
      {
        source: "European Patent Convention (EPC) — Article 54 (Novelty & Prior Art)",
        ref_id: "EPO-EPC-ART54",
        url: "https://www.epo.org/law-practice/legal-texts/epc.html",
      },
      {
        source: "European Patent Convention (EPC) — Article 54(5) (Specific Second Medical Use)",
        ref_id: "EPO-EPC-ART545",
        url: "https://www.epo.org/law-practice/legal-texts/epc.html",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["foreign", "multinational", "without nba", "illegal", "foreign entity", "nri"],
    jurisdiction: "all",
    answer: "Under Section 3 and Section 6 of the Biological Diversity Act, 2002, non-citizens, non-residents, and entities with any foreign equity or participation are strictly prohibited from accessing Indian biological resources or filing for any IPR globally without prior mandatory clearance from the National Biodiversity Authority (Form III). Violations constitute statutory grounds for patent revocation under Section 64 of the Patents Act, 1970, and attract penal liability under Section 55 of BDA 2002.",
    citations: [
      {
        source: "Biological Diversity Act, 2002 — Section 3 & Section 6 (Mandatory Approvals)",
        ref_id: "IN-BDA-2002-SEC3SEC6",
        url: "http://nbaindia.org/uploaded/act/BDACT_2002.pdf",
      },
      {
        source: "The Patents Act, 1970 — Section 64 (Grounds for Patent Revocation)",
        ref_id: "IN-PAT-1970-SEC64",
        url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
      },
    ],
    confidence: "high",
  },
  {
    keywords: ["phytopharmaceutical", "cdsco", "chapter xa", "bioactive", "marker"],
    jurisdiction: "india",
    answer: "Under Chapter XA of the Drugs & Cosmetics Rules, 1945, Phytopharmaceuticals are defined as purified, standardized fractions with minimum 4 validated bioactive markers obtained from an authenticated medicinal plant. Unlike classical Ayurvedic medicines, Phytopharmaceuticals require Phase I to Phase III clinical safety and efficacy data reviewed by the CDSCO Subject Expert Committee (SEC) prior to marketing approval.",
    citations: [
      {
        source: "CDSCO Gazette Notification — Chapter XA (Phytopharmaceutical Drug Regulations)",
        ref_id: "CDSCO-DCR-CHAP-XA",
        url: "https://cdsco.gov.in",
      },
      {
        source: "Drugs and Cosmetics Rules, 1945 — Schedule Y & Rule 122E",
        ref_id: "IN-DCR-1945-SCHY",
        url: "https://cdsco.gov.in",
      },
    ],
    confidence: "high",
  },
];

export function executeStatutoryRag(
  query: string,
  jurisdiction: Jurisdiction,
  classification?: string
): LegalRagResponse {
  const q = query.toLowerCase().trim();

  // Out of scope or refusal check
  const refusalTriggers = [
    "tax evasion", "crypto", "bitcoin", "criminal fine", "jail term for tax",
    "cheat the patent office", "bypass nba legally", "fake clinical trial",
    "evade income tax", "hack", "bypass"
  ];
  if (refusalTriggers.some((t) => q.includes(t))) {
    return {
      answer: "Vigyan Veda operates strictly within statutory Ayush IP, Biological Diversity Act, and TRIPS regulatory frameworks. The submitted query lies outside the statutory scope of ASU patentability intelligence or concerns non-compliant advisory. For inquiries involving criminal liabilities or taxation, please refer to accredited legal counsel.",
      citations: [],
      confidence: "low",
      jurisdiction,
      disclaimer: "Formal statutory authority cannot be established for inquiries outside Ayush regulatory scope.",
      isRefusal: true,
    };
  }

  // Botanical check from authentic TKDL database
  const herbs = OFFLINE_HERBS_DATA as Array<{
    id: string;
    common_name: string;
    sanskrit_name: string;
    scientific_name: string;
    patentability_status: { section_3p: string; section_3e: string; viable_ip_pathways: string[] };
    abs_requirements: { nba_clearance: string; details: string; indian_entity_rule: string };
    classical_texts: string[];
    tkdl_ref_id: string;
  }>;

  const matchedHerb = herbs.find(
    (h) =>
      q.includes(h.id.toLowerCase()) ||
      q.includes(h.common_name.toLowerCase()) ||
      q.includes(h.scientific_name.toLowerCase()) ||
      q.includes(h.sanskrit_name.toLowerCase())
  );

  // Check matching statutory record
  let bestRecord: StatutoryRecord | null = null;
  let bestScore = 0;

  for (const record of STATUTORY_KNOWLEDGE_BASE) {
    if (record.jurisdiction !== "all" && record.jurisdiction !== jurisdiction) {
      continue;
    }
    let score = 0;
    for (const kw of record.keywords) {
      if (q.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestRecord = record;
    }
  }

  if (matchedHerb && bestScore < 8) {
    // Generate tailored botanical statutory answer from TKDL dataset
    const herbAnswer = `For '${matchedHerb.common_name}' (${matchedHerb.scientific_name}, classical ref: ${matchedHerb.classical_texts[0]}):
1. **Patentability Assessment**: ${matchedHerb.patentability_status.section_3p} ${matchedHerb.patentability_status.section_3e}
2. **Viable Pathways**: ${matchedHerb.patentability_status.viable_ip_pathways.join("; ")}
3. **Biodiversity & ABS Compliance**: ${matchedHerb.abs_requirements.details} (${matchedHerb.abs_requirements.indian_entity_rule}).`;

    return {
      answer: herbAnswer,
      citations: [
        {
          source: `TKDL Prior Art Record — ${matchedHerb.sanskrit_name} (${matchedHerb.tkdl_ref_id})`,
          ref_id: matchedHerb.tkdl_ref_id,
          url: "https://www.tkdl.res.in",
        },
        {
          source: "The Patents Act, 1970 — Section 3(p) & Section 3(e)",
          ref_id: "IN-PAT-1970-SEC3P-3E",
          url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
        },
        {
          source: "Biological Diversity Act, 2002 — Section 6 (Mandatory NBA Form III)",
          ref_id: "IN-BDA-2002-SEC6",
          url: "http://nbaindia.org/uploaded/act/BDACT_2002.pdf",
        },
      ],
      confidence: "high",
      jurisdiction,
      disclaimer: "This guidance is synthesized from statutory authorities. Consult an Ayush IP facilitator for official patent drafting.",
    };
  }

  if (bestRecord && bestScore > 0) {
    return {
      answer: bestRecord.answer,
      citations: bestRecord.citations,
      confidence: bestRecord.confidence,
      jurisdiction,
      disclaimer: "This statutory guidance reflects current Acts and Rules. Consult registered counsel before commercial prosecution.",
    };
  }

  // Generalized fallback based on active jurisdiction and classification
  if (jurisdiction === "india") {
    return {
      answer: `Under Indian statutory law (Patents Act, 1970 § 3(p) and Biological Diversity Act, 2002 § 6), herbal products derived from traditional knowledge require strict demarcation between classical prior art and patentable novelty. For '${classification || "Proprietary Ayurvedic Formulation"}', statutory novelty requires demonstrating non-obvious synergistic efficacy under Section 3(e) or novel delivery vectors. Prior Informed Consent from the National Biodiversity Authority (NBA Form III) is mandatory before patent grant.`,
      citations: [
        {
          source: "The Patents Act, 1970 — Section 3(p) (Traditional Knowledge Exclusions)",
          ref_id: "IN-PAT-1970-SEC3P",
          url: "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
        },
        {
          source: "Biological Diversity Act, 2002 — Section 6 (Mandatory NBA Approval for IPR)",
          ref_id: "IN-BDA-2002-SEC6",
          url: "http://nbaindia.org/uploaded/act/BDACT_2002.pdf",
        },
        {
          source: "Drugs & Cosmetics Rules, 1945 — Rule 158B (Proof of Safety & Efficacy for ASU)",
          ref_id: "IN-DCR-1945-RULE158B",
          url: "https://ayush.gov.in",
        },
      ],
      confidence: "medium",
      jurisdiction: "india",
      disclaimer: "Statutory informational guidance under Ministry of Ayush framework.",
    };
  } else {
    return {
      answer: "Under international IP frameworks, inventions derived from biological genetic resources are governed by the Nagoya Protocol on Access and Benefit-Sharing (ABS) and WTO TRIPS Article 27 standards. Prior Informed Consent (PIC) from the provider state and disclosure of source via the ABS Clearing-House (ABSCH) are required across international patent offices (EPO, USPTO, WIPO).",
      citations: [
        {
          source: "Nagoya Protocol on Access and Benefit-Sharing — Articles 6 & 15",
          ref_id: "INT-NAGOYA-ABS-ART6",
          url: "https://www.cbd.int/abs/text/",
        },
        {
          source: "WTO TRIPS Agreement — Article 27 (Patentable Subject Matter & Exclusions)",
          ref_id: "INT-TRIPS-1994-ART27",
          url: "https://www.wto.org/english/docs_e/legal_e/27-trips_04_e.htm",
        },
      ],
      confidence: "medium",
      jurisdiction: "international",
      disclaimer: "International statutory IP guidance. Consult an accredited cross-border patent attorney.",
    };
  }
}
