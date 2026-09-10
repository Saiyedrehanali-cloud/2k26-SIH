"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import JurisdictionToggle from "../../components/JurisdictionToggle";
import DisclaimerBanner from "../../components/DisclaimerBanner";
import ChatBubble from "../../components/ChatBubble";
import EscalationButton from "../../components/EscalationButton";
import FormulationClassifierModal from "../../components/FormulationClassifierModal";
import ResearchRegistrationModal from "../../components/ResearchRegistrationModal";
import {
  ChatMessage,
  Jurisdiction,
  ClassificationType,
  ClassificationResult,
} from "../../lib/types";
import {
  sendChatMessage,
} from "../../lib/api";
import {
  Scale,
  Send,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Tag,
  Info,
  ChevronRight,
  ShieldCheck,
  FileDown,
  FileText,
  BookOpen,
  Lock,
} from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialClassification = searchParams.get("classification") as ClassificationType | null;

  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("india");
  const [classification, setClassification] = useState<ClassificationType | null>(
    initialClassification || "Proprietary Medicine"
  );
  const [isClassifierOpen, setIsClassifierOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: text.trim(),
      jurisdiction,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        text.trim(),
        jurisdiction,
        classification || undefined
      );

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: "assistant",
        text: response.answer,
        citations: response.citations,
        confidence: response.confidence,
        jurisdiction: response.jurisdiction,
        disclaimer: response.disclaimer,
        isRefusal: response.isRefusal,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  const handleExportReport = () => {
    const timestamp = new Date().toLocaleString();
    let report = `# Vigyan Veda — Preliminary Legal Advisory Memo\n`;
    report += `**Ministry of Ayush | Government of India**\n`;
    report += `**Generated:** ${timestamp}\n`;
    report += `**Active Jurisdiction:** ${jurisdiction.toUpperCase()}\n`;
    report += `**Formulation Classification:** ${classification || "Not Specified"}\n\n`;
    report += `---\n\n`;
    report += `## Statutory Citations & Authorities Referenced\n\n`;

    const allCitations: { source: string; ref_id: string; url?: string | null }[] = [];
    const seenRefs = new Set<string>();
    messages.forEach((msg) => {
      (msg.citations || []).forEach((c) => {
        if (!seenRefs.has(c.ref_id)) {
          seenRefs.add(c.ref_id);
          allCitations.push(c);
        }
      });
    });

    if (allCitations.length === 0) {
      report += `*No statutory citations recorded in current session.*\n\n`;
    } else {
      allCitations.forEach((c, idx) => {
        report += `${idx + 1}. **${c.source}** (Ref: \`${c.ref_id}\`)\n   - Official Reference: ${c.url || "Government of India Repository"}\n\n`;
      });
    }

    report += `---\n\n## Assessment Transcript\n\n`;
    messages.forEach((msg) => {
      const sender = msg.sender === "user" ? "Researcher / Applicant" : "Vigyan Veda Legal AI";
      report += `### [${msg.timestamp || ""}] ${sender}\n${msg.text}\n\n`;
      if (msg.confidence) {
        report += `*Confidence Level:* **${msg.confidence.toUpperCase()}** | *Corpus:* ${msg.jurisdiction || jurisdiction}\n\n`;
      }
    });

    report += `---\n\n`;
    report += `### Statutory Disclaimer\n`;
    report += `> This advisory summary is algorithmically generated by Vigyan Veda from authenticated statutory texts (Patents Act 1970, Biological Diversity Act 2002, Drugs & Cosmetics Rules 158B, TKDL prior art, and WTO TRIPS). It provides preliminary informational guidance and does not constitute formal legal counsel or a binding certificate of patentability. For official patent filing or commercial licensing, consult an Ayush IP Facilitator or registered patent attorney.\n`;

    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Vigyan-Veda-Advisory-Memo-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const suggestedQueries = jurisdiction === "india"
    ? [
        "Can I patent an Ashwagandha and Curcumin synergistic polyherbal extract in India?",
        "What approvals are needed from the National Biodiversity Authority (NBA) under Section 6?",
        "What are the regulatory licensing requirements under Rule 158B for a Proprietary Ayurvedic Medicine?",
        "Can a foreign entity file an Indian patent on botanical derivatives without prior NBA clearance?",
        "What are the non-patentability provisions under Section 3(e) for herbal admixtures?",
      ]
    : [
        "What Access and Benefit-Sharing (ABS) requirements apply under the Nagoya Protocol for international PCT patents?",
        "What does WTO TRIPS Article 27 state regarding patentability of plants and therapeutic methods?",
        "How does the EPO evaluate novelty for traditional botanical medicine formulations under Article 54?",
        "What disclosure of origin requirements apply under WIPO genetic resources treaties?",
      ];

  return (
    <div className="flex flex-col h-[100dvh] max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <header className="py-2.5 sm:py-3.5 border-b border-[#E3ECE6] flex flex-col gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 w-full">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2 group text-[#15261D] hover:text-[#1B5E3A] transition-colors flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white p-1 border border-[#A8D5BA] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img src="/logo.png" alt="Vigyan Veda Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#15261D]">Vigyan Veda</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA]">
                  AYUSH
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/explorer"
              prefetch={false}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] hover:border-[#6BBF8A] rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Traditional Knowledge Digital Library (TKDL) Explorer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2E7D5C]" />
              <span className="hidden md:inline">TKDL Explorer</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-[#1B5E3A] hover:bg-[#14462B] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Pre-Register Formulation Research"
            >
              <Lock className="w-3.5 h-3.5 text-[#6BBF8A]" />
              <span className="hidden md:inline">Pre-Register</span>
            </button>

            <button
              type="button"
              onClick={handleExportReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] hover:border-[#6BBF8A] rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Download Advisory Memo"
            >
              <FileDown className="w-3.5 h-3.5 text-[#2E7D5C]" />
              <span className="hidden lg:inline">Export Memo</span>
            </button>

            <EscalationButton />

            <button
              type="button"
              onClick={handleResetChat}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t sm:border-t-0 border-[#E3ECE6]/60">
          <JurisdictionToggle
            currentJurisdiction={jurisdiction}
            onJurisdictionChange={(j) => setJurisdiction(j)}
          />

          {classification && (
            <div className="flex items-center justify-between sm:justify-end gap-1.5 px-2.5 sm:px-3 py-1 bg-[#EAF5EF] border border-[#A8D5BA] rounded-xl text-xs shadow-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Tag className="w-3.5 h-3.5 text-[#4B9B6E] flex-shrink-0" />
                <span className="text-[#475D51] font-medium hidden sm:inline">Formulation:</span>
                <span className="font-bold text-[#1B5E3A] text-xs truncate">{classification}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsClassifierOpen(true)}
                className="text-[10px] font-bold text-[#2E7D5C] hover:text-[#1B5E3A] hover:bg-[#A8D5BA]/30 px-2 py-0.5 rounded transition-all ml-1 cursor-pointer flex-shrink-0 border border-[#A8D5BA]/60"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4 pr-1">
        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-[#E3ECE6] shadow-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#EAF5EF] text-[#2E7D5C] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#2E7D5C]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-[#15261D] truncate">
                Active Corpus: {jurisdiction === "india" ? "India (Statutory Law)" : "International (TRIPS / Nagoya)"}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-[#475D51] hidden sm:block">
                {jurisdiction === "india"
                  ? "Patents Act 1970 § 3(p), Biological Diversity Act 2002 § 6, Drugs & Cosmetics Rules 158B, and TKDL."
                  : "WTO TRIPS Agreement Art 27, Nagoya Protocol on ABS Articles 6/15, and PCT international filing rules."}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase bg-[#EAF5EF] text-[#1B5E3A] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-[#A8D5BA] flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6BBF8A] animate-pulse" />
            Verified
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="py-6 sm:py-10 max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#A8D5BA] p-2 flex items-center justify-center mx-auto shadow-sm">
                <img src="/logo.png" alt="Vigyan Veda Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#15261D]">
                Vigyan Veda Legal Intelligence Workspace
              </h3>
              <p className="text-xs sm:text-sm text-[#475D51] max-w-md mx-auto leading-relaxed">
                Empowering Ayurvedic researchers and biotech startups with statutory certainty across Patents Act 1970, Biological Diversity Act 2002, and Nagoya ABS protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSendMessage("Can I patent an Ashwagandha and Curcumin synergistic polyherbal extract in India?")}
                className="p-3.5 rounded-xl bg-white hover:bg-[#EAF5EF] border border-[#E3ECE6] hover:border-[#A8D5BA] text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B5E3A] bg-[#EAF5EF] px-2 py-0.5 rounded border border-[#A8D5BA]">
                    Patents Act § 3(p)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#2E7D5C] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-semibold text-[#15261D] group-hover:text-[#1B5E3A]">
                  Can I patent an Ashwagandha & Curcumin synergistic polyherbal extract in India?
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage("What approvals are needed from the National Biodiversity Authority (NBA) under Section 6?")}
                className="p-3.5 rounded-xl bg-white hover:bg-[#EAF5EF] border border-[#E3ECE6] hover:border-[#A8D5BA] text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B5E3A] bg-[#EAF5EF] px-2 py-0.5 rounded border border-[#A8D5BA]">
                    BDA 2002 § 6
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#2E7D5C] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-semibold text-[#15261D] group-hover:text-[#1B5E3A]">
                  What mandatory approvals are required from the NBA via Form III before patent filing?
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage("What Access and Benefit-Sharing (ABS) requirements apply under the Nagoya Protocol for international PCT patents?")}
                className="p-3.5 rounded-xl bg-white hover:bg-[#EAF5EF] border border-[#E3ECE6] hover:border-[#A8D5BA] text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B5E3A] bg-[#EAF5EF] px-2 py-0.5 rounded border border-[#A8D5BA]">
                    Nagoya ABS & PCT
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#2E7D5C] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-semibold text-[#15261D] group-hover:text-[#1B5E3A]">
                  What ABS disclosures and Prior Informed Consent (PIC) apply for international filings?
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage("What are the regulatory licensing requirements under Rule 158B for a Proprietary Ayurvedic Medicine?")}
                className="p-3.5 rounded-xl bg-white hover:bg-[#EAF5EF] border border-[#E3ECE6] hover:border-[#A8D5BA] text-left transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B5E3A] bg-[#EAF5EF] px-2 py-0.5 rounded border border-[#A8D5BA]">
                    D&C Rule 158B
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#2E7D5C] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs font-semibold text-[#15261D] group-hover:text-[#1B5E3A]">
                  What safety and efficacy standards are required for Proprietary ASU licensing?
                </p>
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onEscalate={() => {
                const btn = document.querySelector('[data-escalate-trigger]') as HTMLButtonElement;
                if (btn) btn.click();
              }}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2.5 my-3">
            <div className="w-7 h-7 rounded-full bg-[#EAF5EF] text-[#2E7D5C] flex items-center justify-center animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-[#E3ECE6] rounded-2xl px-4 py-2.5 shadow-xs text-xs text-[#475D51] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E7D5C] animate-ping" />
              <span>Cross-referencing statutory authorities ({jurisdiction})...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      <footer className="pt-2 pb-3 sm:pb-4 flex-shrink-0 space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#1B5E3A] whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#4B9B6E]" />
            Suggested:
          </span>
          {suggestedQueries.map((query, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(query)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white hover:bg-[#EAF5EF] border border-[#A8D5BA]/80 hover:border-[#6BBF8A] text-[#1B5E3A] text-[10px] sm:text-[11px] font-medium whitespace-nowrap shadow-xs transition-all cursor-pointer flex items-center gap-1 group"
            >
              <span>{query}</span>
              <ChevronRight className="w-3 h-3 text-[#4B9B6E] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>

        <DisclaimerBanner />

        <div className="relative flex items-center bg-white border border-[#A8D5BA] rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-[#2E7D5C] focus-within:border-[#2E7D5C] transition-all p-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a legal or regulatory question in ${jurisdiction === "india" ? "India" : "International"} jurisdiction...`}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#15261D] placeholder-gray-400 bg-transparent focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 sm:p-2.5 rounded-xl bg-[#2E7D5C] hover:bg-[#1B5E3A] text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            aria-label="Send Message"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </footer>

      <FormulationClassifierModal
        isOpen={isClassifierOpen}
        onClose={() => setIsClassifierOpen(false)}
        onClassificationComplete={(res) => setClassification(res.classification)}
      />

      <ResearchRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background text-xs text-[#475D51]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E3A] animate-ping" />
            <span>Loading Vigyan Veda Chat Workspace...</span>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

