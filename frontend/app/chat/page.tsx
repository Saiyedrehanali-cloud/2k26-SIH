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
  MOCK_SEED_MESSAGES,
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
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_SEED_MESSAGES);
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
        "Can a foreign multinational file a patent on Indian neem without NBA clearance?",
        "Out of scope query: How do I bake a chocolate cake? (Refusal Guardrail)",
      ]
    : [
        "What Access and Benefit-Sharing (ABS) requirements apply under the Nagoya Protocol for international PCT patents?",
        "What does WTO TRIPS Article 27 state regarding patentability of plants and therapeutic methods?",
        "Can a foreign multinational file a patent on Indian neem without NBA clearance?",
        "Out of scope query: Explain foreign corporate income tax? (Refusal Guardrail)",
      ];

  return (
    <div className="flex flex-col h-[100dvh] max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 bg-background">
      {/* 1. Header Bar (Bento style) */}
      <header className="py-3 sm:py-4 border-b border-[#E3ECE6] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-4 flex-shrink-0">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Link
            href="/"
            className="flex items-center gap-2.5 group text-[#15261D] hover:text-[#1B5E3A] transition-colors"
          >
            <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-[#A8D5BA] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img src="/logo.png" alt="Vigyan Veda Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#15261D]">Vigyan Veda</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA]">
                  AYUSH RAG
                </span>
              </div>
              <p className="text-[11px] text-[#475D51] hidden sm:block">Statutory IP & Biodiversity Assistant</p>
            </div>
          </Link>

          {/* Classification Chip (FR1: persists in session and shown as chip in chat header) */}
          {classification && (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#EAF5EF] border border-[#A8D5BA] rounded-xl text-xs shadow-xs">
              <Tag className="w-3.5 h-3.5 text-[#4B9B6E]" />
              <span className="text-[#475D51] font-medium hidden sm:inline">Formulation:</span>
              <span className="font-bold text-[#1B5E3A] text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-none">{classification}</span>
              <button
                type="button"
                onClick={() => setIsClassifierOpen(true)}
                className="text-[10px] font-semibold text-[#2E7D5C] hover:text-[#1B5E3A] hover:bg-[#A8D5BA]/30 px-1.5 py-0.5 rounded transition-all ml-0.5 cursor-pointer"
                title="Change formulation classification"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Center: Jurisdiction Toggle (FR2 & Architecture §4: visually unmistakable) */}
        <div className="flex justify-center items-center">
          <JurisdictionToggle
            currentJurisdiction={jurisdiction}
            onJurisdictionChange={(j) => setJurisdiction(j)}
          />
        </div>

        {/* Right Actions: TKDL Explorer, Pre-Register, Export Memo, Escalation CTA & Reset */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-wrap">
          <Link
            href="/explorer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] hover:border-[#6BBF8A] rounded-xl text-xs font-bold shadow-xs transition-all"
            title="Search Traditional Knowledge Digital Library (TKDL) Explorer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2E7D5C]" />
            <span className="hidden sm:inline">TKDL Explorer</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B5E3A] hover:bg-[#14462B] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Pre-Register Ongoing Formulation Research to Prevent Conflicts"
          >
            <Lock className="w-3.5 h-3.5 text-[#6BBF8A]" />
            <span className="hidden sm:inline">Pre-Register</span>
          </button>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] hover:border-[#6BBF8A] rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Download Official Legal Advisory Memo"
          >
            <FileDown className="w-3.5 h-3.5 text-[#2E7D5C]" />
            <span className="hidden md:inline">Export Memo</span>
          </button>
          <EscalationButton />
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Chat Area */}
      <main className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
        {/* Jurisdiction Active Context Banner */}
        <div className="bg-white rounded-2xl p-4 border border-[#E3ECE6] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF5EF] text-[#2E7D5C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#2E7D5C]" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#15261D]">
                Active Legal Corpus: {jurisdiction === "india" ? "India (Domestic Statutory Law)" : "International (TRIPS & Nagoya Framework)"}
              </h2>
              <p className="text-[11px] text-[#475D51]">
                {jurisdiction === "india"
                  ? "Queries search Patents Act 1970 § 3(p), Biological Diversity Act 2002 § 6, Drugs & Cosmetics Rules 158B, and TKDL prior art."
                  : "Queries search WTO TRIPS Agreement Art 27.2/27.3(b), Nagoya Protocol on ABS Articles 6/15, and PCT international filing rules."}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase bg-[#EAF5EF] text-[#1B5E3A] font-bold px-2.5 py-1 rounded-md border border-[#A8D5BA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6BBF8A] animate-pulse" />
            Strict Filter On
          </span>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#A8D5BA] p-1.5 flex items-center justify-center mx-auto shadow-xs">
              <img src="/logo.png" alt="Vigyan Veda Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-base font-bold text-[#15261D]">How can Vigyan Veda assist your formulation?</h3>
            <p className="text-xs text-[#475D51] max-w-md mx-auto">
              Ask any question regarding patentability under Indian law or international biodiversity access compliance.
            </p>
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

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-border rounded-2xl px-5 py-3.5 shadow-sm text-xs text-charcoal-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal animate-ping" />
              <span>Retrieving verified statute sections from Chroma vector corpus ({jurisdiction})...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* 3. Bottom Controls: Suggestions + Persistent Disclaimer + Input */}
      <footer className="pt-2 pb-4 flex-shrink-0 space-y-2">
        {/* Suggested demo chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-[#1B5E3A] whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#4B9B6E]" />
            Suggested:
          </span>
          {suggestedQueries.map((query, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(query)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF5EF] border border-[#A8D5BA]/80 hover:border-[#6BBF8A] text-[#1B5E3A] text-[11px] font-medium whitespace-nowrap shadow-xs transition-all cursor-pointer flex items-center gap-1.5 group"
            >
              <span>{query}</span>
              <ChevronRight className="w-3 h-3 text-[#4B9B6E] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>

        {/* Persistent Disclaimer Banner (FR5: pinned above chat input) */}
        <DisclaimerBanner />

        {/* Chat Input Bar */}
        <div className="relative flex items-center bg-white border border-[#A8D5BA] rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-[#2E7D5C] focus-within:border-[#2E7D5C] transition-all p-1.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a legal or regulatory question in ${jurisdiction === "india" ? "India" : "International"} jurisdiction...`}
            className="flex-1 px-4 py-2.5 text-sm text-[#15261D] placeholder-gray-400 bg-transparent focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#2E7D5C] hover:bg-[#1B5E3A] text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Formulation Classifier Modal */}
      <FormulationClassifierModal
        isOpen={isClassifierOpen}
        onClose={() => setIsClassifierOpen(false)}
        onClassificationComplete={(res) => setClassification(res.classification)}
      />

      {/* Research Pre-Registration Modal */}
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

