"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DisclaimerBanner from "../components/DisclaimerBanner";
import FormulationClassifierModal from "../components/FormulationClassifierModal";
import { ClassificationResult } from "../lib/types";
import {
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  BookOpen,
  Globe,
  FileCheck,
  Building2,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isClassifierOpen, setIsClassifierOpen] = useState(false);

  const handleClassificationComplete = (result: ClassificationResult) => {
    // Save to localStorage or pass as query param to chat
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ayush_classification", JSON.stringify(result));
    }
    router.push(`/chat?classification=${encodeURIComponent(result.classification)}`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center font-bold shadow-md shadow-teal/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-charcoal">IP-SAKTI Sahayak</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-light text-teal border border-teal-border">
                Ministry of AYUSH
              </span>
            </div>
            <p className="text-xs text-charcoal-muted">AI-Powered IPR, Patent & Biodiversity Compliance Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 hidden sm:inline">Problem SIH26045</span>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-charcoal text-xs font-semibold border border-gray-200 shadow-sm transition-all"
          >
            <span>Skip to Chat</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal" />
          </Link>
        </div>
      </header>

      {/* Persistent Regulatory Notice */}
      <div className="my-6">
        <DisclaimerBanner customText="Statutory Informational Assistant: IP-SAKTI Sahayak pre-screens ASU formulation claims and queries against legal databases with mandatory citation grounding. It does not provide formal legal counsel." />
      </div>

      {/* Hero Section / Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4">
        {/* Main Hero Card (span 8) */}
        <div className="md:col-span-8 bg-card rounded-3xl p-8 border border-border shadow-bento flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-light/60 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-light text-orange text-xs font-bold uppercase tracking-wider mb-4 border border-orange-border">
              <Sparkles className="w-3.5 h-3.5 text-orange" />
              <span>Zero Hallucinated Legal Claims</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
              Statutory IP & Biodiversity Guidance for{" "}
              <span className="text-teal">Ayurvedic Innovators</span>
            </h2>

            <p className="text-sm sm:text-base text-charcoal-muted mt-4 max-w-2xl leading-relaxed">
              Navigate Indian patent law (§ 3(p) Traditional Knowledge exclusions), Biological Diversity Act (NBA § 6 clearance), TKDL prior art, and international TRIPS / Nagoya Protocol compliance with 100% citation-backed certainty.
            </p>
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsClassifierOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange hover:bg-orange-hover text-white text-sm font-bold shadow-md shadow-orange/25 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Classify Formulation (Recommended)</span>
            </button>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal hover:bg-teal-hover text-white text-sm font-bold shadow-md shadow-teal/25 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Direct Chat Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Info Bento (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-border shadow-bento flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3">
              <FileCheck className="w-4 h-4 text-teal" />
              <span>Core Mandate</span>
            </div>
            <h3 className="text-base font-bold text-charcoal">Verifiable Citations Required</h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              Every answer is parsed into direct answer, statutory citations, and confidence badge. Any answer lacking statutory evidence is strictly blocked by the UI guardrail.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
              <Globe className="w-4 h-4 text-orange" />
              <span>Isolated Jurisdictions</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-normal">
              Switch cleanly between <strong>India Law</strong> (Patents Act, BDA 2002, TKDL) and <strong>International</strong> (TRIPS Art 27, Nagoya ABS) without cross-contamination.
            </p>
          </div>

          <div className="text-[11px] text-gray-400">
            Powered by RAG with strict semantic chunk boundaries on statute sections.
          </div>
        </div>

        {/* Feature Bento 1 (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-border shadow-bento space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-light text-teal flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-charcoal">1. Formulation Classifier</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Deterministic 4-question decision tree mapping formulations to Classical Medicine, Proprietary ASU, Phytopharmaceutical, Ayurveda-Aahar, or Cosmetics.
          </p>
        </div>

        {/* Feature Bento 2 (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-border shadow-bento space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-light text-orange flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-charcoal">2. Refusal Guardrails</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            When statutory confidence is low or ambiguous, the assistant triggers a distinct refusal card rather than hallucinating plausible legal advice.
          </p>
        </div>

        {/* Feature Bento 3 (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-border shadow-bento space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-confidence-high flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-charcoal">3. Empanelled Facilitators</h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Direct escalation route to Ministry of AYUSH empanelled patent attorneys for formal patent drafting and NBA Section 6 filings.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="flex items-center gap-2">
          <span>Smart India Hackathon 2024 — Problem SIH26045</span>
          <span>•</span>
          <span>Ministry of AYUSH</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="hover:text-teal font-medium">Chat Assistant</Link>
          <button type="button" onClick={() => setIsClassifierOpen(true)} className="hover:text-orange font-medium cursor-pointer">
            Run Classifier
          </button>
        </div>
      </footer>

      {/* Formulation Classifier Modal */}
      <FormulationClassifierModal
        isOpen={isClassifierOpen}
        onClose={() => setIsClassifierOpen(false)}
        onClassificationComplete={handleClassificationComplete}
      />
    </div>
  );
}
