"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { searchHerbs } from "../../lib/api";
import { HerbDetail } from "../../lib/types";
import ResearchRegistrationModal from "../../components/ResearchRegistrationModal";
import {
  Search,
  BookOpen,
  ShieldAlert,
  Scale,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  Layers,
  FileCheck,
  ChevronRight,
  X,
  Dna,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

export default function ExplorerPage() {
  const [herbs, setHerbs] = useState<HerbDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHerb, setSelectedHerb] = useState<HerbDetail | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [prefilledHerb, setPrefilledHerb] = useState("");

  const fetchHerbs = async (query = "", filter = "all") => {
    setIsLoading(true);
    try {
      const data = await searchHerbs(query, filter);
      setHerbs(data.results);
    } catch (err) {
      console.error("Failed to fetch herbs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHerbs(searchQuery, activeFilter);
  }, [activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHerbs(searchQuery, activeFilter);
  };

  const handleOpenRegistration = (herbName?: string) => {
    if (herbName) {
      setPrefilledHerb(herbName);
    }
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 sm:pb-6 border-b border-[#E3ECE6] gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" prefetch={false} className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white p-1 border border-[#A8D5BA] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img src="/logo.png" alt="Vigyan Veda Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#15261D]">Vigyan Veda</h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] whitespace-nowrap">
                  TKDL Explorer
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#475D51]">
                Statutory Botanical Prior Art, § 3(p) Patent Exclusions & NBA § 6 Compliance
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 justify-end flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => handleOpenRegistration()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#14462B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer text-center"
          >
            <Lock className="w-3.5 h-3.5 text-[#6BBF8A]" />
            <span>Pre-Register Research</span>
          </button>

          <Link
            href="/chat"
            prefetch={false}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] text-xs font-bold border border-[#A8D5BA] shadow-xs transition-all text-center"
          >
            <span>Legal Chat</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2E7D5C]" />
          </Link>
        </div>
      </header>

      {/* Main Search & Filter Section */}
      <main className="flex-1 my-6 space-y-6">
        {/* Search Bar Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3ECE6] shadow-bento space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#15261D]">Search Botanical Prior Art & TKDL Dossiers</h2>
            <p className="text-xs text-[#475D51]">
              Cross-reference Ayurvedic plants against Traditional Knowledge Digital Library entries and Section 3(p) exclusions before drafting patent claims.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#71867A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by common name (Ashwagandha, Turmeric, Neem), scientific binomial, or bioactive..."
              className="w-full pl-11 pr-24 py-3 bg-[#F7FAF8] border border-[#A8D5BA] rounded-2xl text-xs sm:text-sm text-[#15261D] placeholder-[#71867A] focus:outline-none focus:ring-2 focus:ring-[#2E7D5C] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-[#2E7D5C] hover:bg-[#1B5E3A] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Filter Tabs - Mobile Scrollable, Laptop Row */}
          <div className="flex items-center gap-2 pt-1 text-xs overflow-x-auto pb-1.5 no-scrollbar sm:flex-wrap">
            <span className="text-[11px] font-bold text-[#1B5E3A] mr-1 whitespace-nowrap">Filter By:</span>
            {[
              { id: "all", label: "All Cataloged Botanicals" },
              { id: "3p", label: "Section 3(p) High Scrutiny" },
              { id: "nba", label: "NBA § 6 Clearance Mandatory" },
              { id: "active", label: "Has Pre-Registered Startups" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-[#1B5E3A] text-white shadow-xs"
                    : "bg-white text-[#475D51] hover:text-[#1B5E3A] hover:bg-[#EAF5EF] border border-[#A8D5BA]/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Herb Bento Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#15261D]">
              Showing {herbs.length} Botanical Dossier{herbs.length === 1 ? "" : "s"}
            </span>
            <span className="text-[11px] text-[#71867A]">
              Grounding: CSIR-TKDL & Patents Act 1970
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-6 border border-[#E3ECE6] shadow-bento h-64 animate-pulse space-y-4">
                  <div className="h-6 bg-[#EAF5EF] rounded-md w-2/3" />
                  <div className="h-4 bg-[#F2F8F4] rounded-md w-1/2" />
                  <div className="h-20 bg-[#F7FAF8] rounded-xl" />
                </div>
              ))}
            </div>
          ) : herbs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#E3ECE6] shadow-bento text-center space-y-3">
              <BookOpen className="w-8 h-8 text-[#71867A] mx-auto" />
              <h3 className="text-sm font-bold text-[#15261D]">No matching botanical found</h3>
              <p className="text-xs text-[#475D51] max-w-sm mx-auto">
                Try searching for classical plants like "Ashwagandha", "Curcuma", "Neem", "Brahmi", or "Tulsi".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {herbs.map((herb) => (
                <div
                  key={herb.id}
                  className="bg-white rounded-3xl p-6 border border-[#E3ECE6] shadow-bento flex flex-col justify-between hover:border-[#6BBF8A] hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#E3ECE6] pb-3">
                      <div>
                        <span className="text-[11px] font-bold text-[#2E7D5C] block">
                          {herb.sanskrit_name}
                        </span>
                        <h3 className="text-base font-extrabold text-[#15261D] group-hover:text-[#1B5E3A] transition-colors">
                          {herb.common_name}
                        </h3>
                        <span className="text-xs italic text-[#475D51]">
                          {herb.scientific_name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold bg-[#EAF5EF] text-[#1B5E3A] px-2 py-0.5 rounded border border-[#A8D5BA] flex-shrink-0">
                        {herb.tkdl_ref_id}
                      </span>
                    </div>

                    {/* Section 3(p) Patent Status Badge */}
                    <div className="p-3 bg-[#F2F8F4] rounded-xl border border-[#A8D5BA]/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B5E3A]">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#2E7D5C]" />
                        <span>Patentability Scrutiny</span>
                      </div>
                      <p className="text-[11px] text-[#475D51] leading-relaxed line-clamp-2">
                        {herb.patentability_status.section_3p}
                      </p>
                    </div>

                    {/* Traditional Uses Pills */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#71867A] block mb-1">
                        Classical TKDL Indications
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {herb.traditional_uses.slice(0, 2).map((use, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#EAF5EF] text-[#1B5E3A] px-2 py-0.5 rounded-md border border-[#A8D5BA]"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Bioactives */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#71867A] block mb-1">
                        Key Bioactive Markers
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#15261D]">
                        <Dna className="w-3.5 h-3.5 text-[#4B9B6E]" />
                        <span className="text-[11px] text-[#475D51] font-medium truncate">
                          {herb.key_bioactives.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-3 border-t border-[#E3ECE6] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenRegistration(herb.common_name)}
                      className="text-[11px] font-bold text-[#2E7D5C] hover:text-[#1B5E3A] flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-[#4B9B6E]" />
                      <span>Pre-Register</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedHerb(herb)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1B5E3A] hover:text-[#2E7D5C] cursor-pointer"
                    >
                      <span>Full Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detailed Botanical Dossier Modal */}
      {selectedHerb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E3ECE6] relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-5">
            <button
              type="button"
              onClick={() => setSelectedHerb(null)}
              className="absolute top-5 right-5 text-[#71867A] hover:text-[#15261D] p-1.5 rounded-xl hover:bg-[#F2F8F4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-[#E3ECE6] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold bg-[#EAF5EF] text-[#1B5E3A] px-2.5 py-0.5 rounded-full border border-[#A8D5BA]">
                  {selectedHerb.tkdl_ref_id}
                </span>
                <span className="text-xs font-semibold text-[#71867A]">{selectedHerb.family}</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#15261D] mt-1">
                {selectedHerb.common_name} ({selectedHerb.sanskrit_name})
              </h3>
              <p className="text-xs italic text-[#475D51] font-medium">
                {selectedHerb.scientific_name}
              </p>
            </div>

            {/* Patentability Analysis Box */}
            <div className="p-4 bg-[#F2F8F4] rounded-2xl border border-[#A8D5BA] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B5E3A] uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-[#2E7D5C]" />
                <span>Patents Act 1970 § 3(p) & § 3(e) Analysis</span>
              </div>
              <p className="text-xs text-[#15261D] leading-relaxed">
                {selectedHerb.patentability_status.section_3p}
              </p>
              {selectedHerb.patentability_status.section_3e && (
                <p className="text-xs text-[#475D51] leading-relaxed border-t border-[#A8D5BA]/40 pt-2">
                  <strong>Admixture Exclusion:</strong> {selectedHerb.patentability_status.section_3e}
                </p>
              )}
            </div>

            {/* Viable IP Pathways */}
            {selectedHerb.patentability_status.viable_ip_pathways && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#15261D] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#4B9B6E]" />
                  Viable Legal Pathways to Patentability
                </span>
                <ul className="space-y-1.5 text-xs text-[#475D51]">
                  {selectedHerb.patentability_status.viable_ip_pathways.map((pathway, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#F7FAF8] p-2.5 rounded-xl border border-[#E3ECE6]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D5C] flex-shrink-0 mt-0.5" />
                      <span>{pathway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* NBA Access & Benefit Sharing (ABS) Requirements */}
            <div className="p-4 bg-white rounded-2xl border border-[#E3ECE6] space-y-2">
              <span className="text-xs font-bold text-[#15261D] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#2E7D5C]" />
                Biological Diversity Act (BDA 2002 § 6) Mandates
              </span>
              <p className="text-xs text-[#475D51] leading-relaxed">
                {selectedHerb.abs_requirements.details}
              </p>
              {selectedHerb.abs_requirements.indian_entity_rule && (
                <div className="text-[11px] text-[#1B5E3A] bg-[#EAF5EF] p-2.5 rounded-xl border border-[#A8D5BA]/60">
                  <strong>Indian Applicant Rule:</strong> {selectedHerb.abs_requirements.indian_entity_rule}
                </div>
              )}
            </div>

            {/* Classical Ayurvedic Text Citations */}
            {selectedHerb.classical_texts && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#15261D] uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#4B9B6E]" />
                  Authoritative Classical Citations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHerb.classical_texts.map((cit, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-[11px] font-mono bg-[#F7FAF8] text-[#15261D] px-2.5 py-1 rounded-lg border border-[#E3ECE6]"
                    >
                      {cit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#E3ECE6] flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/chat?classification=${encodeURIComponent("Proprietary Medicine")}`}
                prefetch={false}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <span>Ask AI Assistant about {selectedHerb.common_name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E7D5C]" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  const name = selectedHerb.common_name;
                  setSelectedHerb(null);
                  handleOpenRegistration(name);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#14462B] text-white text-xs font-bold shadow-md shadow-[#1B5E3A]/20 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#6BBF8A]" />
                <span>Pre-Register Formulation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ResearchRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setPrefilledHerb("");
        }}
        onSuccess={() => {
          fetchHerbs(searchQuery, activeFilter);
        }}
      />

      <footer className="mt-8 pt-6 border-t border-[#E3ECE6] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71867A] gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="font-semibold text-[#1B5E3A]">Vigyan Veda</span>
          <span>•</span>
          <span>SIH26045</span>
          <span>•</span>
          <span>Traditional Knowledge Digital Library (TKDL) Explorer</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" prefetch={false} className="hover:text-[#1B5E3A] font-semibold">Home</Link>
          <Link href="/chat" prefetch={false} className="hover:text-[#1B5E3A] font-semibold">Chat Assistant</Link>
          <button
            type="button"
            onClick={() => handleOpenRegistration()}
            className="hover:text-[#1B5E3A] font-semibold cursor-pointer"
          >
            Pre-Register Innovation
          </button>
        </div>
      </footer>
    </div>
  );
}
