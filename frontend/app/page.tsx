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
      <header className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#E3ECE6] gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-[#A8D5BA] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Vigyan Veda Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#15261D]">Vigyan Veda</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] whitespace-nowrap">
                  Ministry of AYUSH
                </span>
              </div>
              <p className="text-xs text-[#475D51]">AI Assistant for Ayurveda IP, Patents & Biodiversity Compliance</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
          <Link
            href="/explorer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] text-xs font-bold border border-[#A8D5BA] shadow-xs transition-all text-center"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2E7D5C]" />
            <span>TKDL Explorer</span>
          </Link>
          <Link
            href="/chat"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#14462B] text-white text-xs font-bold shadow-xs transition-all text-center"
          >
            <span>Legal Chat</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </header>

      {/* Persistent Regulatory Notice */}
      <div className="my-5">
        <DisclaimerBanner customText="Statutory Informational Assistant: Vigyan Veda pre-screens ASU formulation claims and queries against legal databases with mandatory citation grounding. It does not provide formal legal counsel." />
      </div>

      {/* Hero Section / Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 my-4">
        {/* Main Hero Card (span 8) */}
        <div className="md:col-span-8 bg-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E3ECE6] shadow-bento flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8D5BA]/25 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EF] text-[#1B5E3A] text-xs font-bold uppercase tracking-wider mb-4 border border-[#A8D5BA]">
              <Sparkles className="w-3.5 h-3.5 text-[#4B9B6E]" />
              <span>Zero Hallucinated Legal Claims</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15261D] tracking-tight leading-snug">
              Statutory IP & Biodiversity Guidance for{" "}
              <span className="text-[#2E7D5C]">Ayurvedic Innovators</span>
            </h2>

            <p className="text-xs sm:text-sm lg:text-base text-[#475D51] mt-4 max-w-2xl leading-relaxed">
              Navigate Indian patent law (§ 3(p) Traditional Knowledge exclusions), Biological Diversity Act (NBA § 6 clearance), TKDL prior art, and international TRIPS / Nagoya Protocol compliance with 100% citation-backed certainty.
            </p>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsClassifierOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1B5E3A] hover:bg-[#14462B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#1B5E3A]/25 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-[#6BBF8A]" />
              <span>Classify Formulation (Recommended)</span>
            </button>

            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#2E7D5C] hover:bg-[#1B5E3A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#2E7D5C]/25 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Direct Chat Assistant</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              href="/explorer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] text-xs sm:text-sm font-bold border-2 border-[#1B5E3A] shadow-sm transition-all cursor-pointer hover:scale-[1.01]"
            >
              <BookOpen className="w-4 h-4 text-[#2E7D5C]" />
              <span>Explore TKDL Database</span>
            </Link>
          </div>
        </div>

        {/* Right Info Bento (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-[#E3ECE6] shadow-bento flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#475D51] mb-3">
              <FileCheck className="w-4 h-4 text-[#2E7D5C]" />
              <span>Core Mandate</span>
            </div>
            <h3 className="text-base font-bold text-[#15261D]">Verifiable Citations Required</h3>
            <p className="text-xs text-[#475D51] mt-2 leading-relaxed">
              Every answer is parsed into direct answer, statutory citations, and confidence badge. Any answer lacking statutory evidence is strictly blocked by the UI guardrail.
            </p>
          </div>

          <div className="p-4 bg-[#F2F8F4] rounded-2xl border border-[#A8D5BA]/60 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#15261D]">
              <Globe className="w-4 h-4 text-[#4B9B6E]" />
              <span>Isolated Jurisdictions</span>
            </div>
            <p className="text-[11px] text-[#475D51] leading-normal">
              Switch cleanly between <strong>India Law</strong> (Patents Act, BDA 2002, TKDL) and <strong>International</strong> (TRIPS Art 27, Nagoya ABS) without cross-contamination.
            </p>
          </div>

          <div className="text-[11px] text-[#71867A]">
            Powered by RAG with strict semantic chunk boundaries on statute sections.
          </div>
        </div>

        {/* Feature Bento 1 (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-[#E3ECE6] shadow-bento space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#2E7D5C] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#4B9B6E]" />
          </div>
          <h4 className="text-sm font-bold text-[#15261D]">1. Formulation Classifier</h4>
          <p className="text-xs text-[#475D51] leading-relaxed">
            Deterministic 4-question decision tree mapping formulations to Classical Medicine, Proprietary ASU, Phytopharmaceutical, Ayurveda-Aahar, or Cosmetics.
          </p>
        </div>

        {/* Feature Bento 2 (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-[#E3ECE6] shadow-bento space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2F8F4] text-[#1B5E3A] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#2E7D5C]" />
          </div>
          <h4 className="text-sm font-bold text-[#15261D]">2. Refusal Guardrails</h4>
          <p className="text-xs text-[#475D51] leading-relaxed">
            When statutory confidence is low or ambiguous, the assistant triggers a distinct refusal card rather than hallucinating plausible legal advice.
          </p>
        </div>

        {/* Feature Bento 3 (span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-[#E3ECE6] shadow-bento space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#1B5E3A] flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-[#1B5E3A]" />
          </div>
          <h4 className="text-sm font-bold text-[#15261D]">3. Empanelled Facilitators</h4>
          <p className="text-xs text-[#475D51] leading-relaxed">
            Direct escalation route to Ministry of AYUSH empanelled patent attorneys for formal patent drafting and NBA Section 6 filings.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-[#E3ECE6] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71867A] gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="font-semibold text-[#1B5E3A]">Vigyan Veda</span>
          <span>•</span>
          <span>Smart India Hackathon (SIH26045)</span>
          <span>•</span>
          <span>Ministry of AYUSH</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="hover:text-[#1B5E3A] font-semibold">Chat Assistant</Link>
          <button type="button" onClick={() => setIsClassifierOpen(true)} className="hover:text-[#1B5E3A] font-semibold cursor-pointer">
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
