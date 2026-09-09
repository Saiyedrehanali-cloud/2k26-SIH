"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import JurisdictionToggle from "../../components/JurisdictionToggle";
import ChatBubble from "../../components/ChatBubble";
import InlineClassifier from "../../components/InlineClassifier";
import {
  ChatMessage,
  Jurisdiction,
  ClassificationType,
} from "../../lib/types";
import {
  MOCK_SEED_MESSAGES,
  sendChatMessage,
} from "../../lib/api";
import { ArrowUp, RotateCcw, FileDown } from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const initialClassification = searchParams.get("classification") as ClassificationType | null;

  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("india");
  const [classification, setClassification] = useState<ClassificationType | null>(
    initialClassification || "Proprietary Medicine"
  );
  const [showInlineClassifier, setShowInlineClassifier] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_SEED_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFacilitatorModal, setShowFacilitatorModal] = useState(false);
  const hasHandledInitialQuery = useRef(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, showInlineClassifier]);

  // Handle incoming query from landing page
  useEffect(() => {
    if (initialQuery && !hasHandledInitialQuery.current) {
      hasHandledInitialQuery.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

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
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: "assistant",
        text: "I was unable to retrieve statutory provisions at this moment. Please check your connection or try again.",
        confidence: "low",
        jurisdiction,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    setShowInlineClassifier(false);
  };

  const handleExportReport = () => {
    const timestamp = new Date().toLocaleString();
    let report = `# IP-SAKTI Sahayak — Legal Advisory Summary\n`;
    report += `Generated: ${timestamp}\n`;
    report += `Active Jurisdiction: ${jurisdiction.toUpperCase()}\n`;
    report += `Formulation Type: ${classification || "Unspecified"}\n\n`;
    report += `---\n\n`;
    report += `## Statutory References\n\n`;

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
      report += `No direct statutory citations referenced in this conversation.\n\n`;
    } else {
      allCitations.forEach((c, idx) => {
        report += `${idx + 1}. ${c.source} (${c.ref_id})\n   URL: ${c.url || "Government of India Repository"}\n\n`;
      });
    }

    report += `---\n\n## Conversation Transcript\n\n`;
    messages.forEach((msg) => {
      const sender = msg.sender === "user" ? "Applicant" : "IP-SAKTI Legal AI";
      report += `[${msg.timestamp || ""}] ${sender}:\n${msg.text}\n\n`;
    });

    report += `---\n\n`;
    report += `Notice: Informational guidance only, derived from authentic statutory texts. Not formal legal advice.\n`;

    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IP-SAKTI-Summary-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col justify-between selection:bg-blue-100">
      {/* 1. Quiet, minimal top bar */}
      <header className="border-b border-slate-200 bg-page/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-2xl w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-800 hover:text-slate-900 tracking-tight"
            >
              IP-SAKTI Sahayak
            </Link>
            <span className="text-slate-300">/</span>
            {/* Small unobtrusive jurisdiction control */}
            <JurisdictionToggle
              currentJurisdiction={jurisdiction}
              onJurisdictionChange={(j) => setJurisdiction(j)}
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            {/* Inline classifier toggle chip */}
            <button
              type="button"
              onClick={() => setShowInlineClassifier(!showInlineClassifier)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
              title="Change formulation type"
            >
              {classification || "Formulation"} ▾
            </button>

            <button
              type="button"
              onClick={handleExportReport}
              className="hover:text-slate-900 transition-colors cursor-pointer p-1"
              title="Export conversation summary"
            >
              <FileDown className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetChat}
              className="hover:text-slate-900 transition-colors cursor-pointer p-1"
              title="Clear conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Single vertical conversation thread (max-w ~680px) */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 overflow-y-auto">
        {/* Inline Classifier prompt if triggered */}
        {showInlineClassifier && (
          <div className="mb-6">
            <InlineClassifier
              currentClassification={classification}
              onSelect={(cat) => {
                setClassification(cat);
                setShowInlineClassifier(false);
              }}
            />
          </div>
        )}

        {/* Message Thread */}
        {messages.length === 0 ? (
          <div className="text-center py-20 space-y-2">
            <p className="text-sm text-slate-600">Start a conversation.</p>
            <p className="text-xs text-slate-400">
              Inquire about Indian patent exclusions under Section 3(p), Biological Diversity Act clearance, or international Nagoya protocol rules.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onEscalate={() => setShowFacilitatorModal(true)}
              />
            ))}
          </div>
        )}

        {/* Quiet Loading State */}
        {isLoading && (
          <div className="flex justify-start my-5 pl-4 border-l-2 border-slate-200 fade-in">
            <span className="text-xs text-slate-400 font-normal">
              Searching statutory provisions...
            </span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </main>

      {/* 3. Quiet floating bottom input */}
      <footer className="sticky bottom-0 bg-page/90 backdrop-blur-sm border-t border-slate-200/80 py-3 z-20">
        <div className="max-w-2xl w-full mx-auto px-4 space-y-2">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a legal or regulatory question..."
              className="w-full px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
              className="mr-2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity cursor-pointer flex-shrink-0"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-normal">
            Informational guidance only, not formal legal advice.
          </p>
        </div>
      </footer>

      {/* Unobtrusive Facilitator Contact Dialog */}
      {showFacilitatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-md max-w-md w-full p-5 space-y-4 fade-in">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Consult an Ayush IP Facilitator
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Connect with registered patent attorneys and National Biodiversity Authority compliance facilitators for binding legal counsel.
              </p>
            </div>

            <div className="text-xs space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700">
              <p><span className="font-medium">Facilitation Cell:</span> Ministry of AYUSH & CSIR-TKDL</p>
              <p><span className="font-medium">Email:</span> ipr-cell@ayush.gov.in</p>
              <p><span className="font-medium">Helpline:</span> 1800-11-2233 (Toll Free)</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setShowFacilitatorModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <a
                href="mailto:ipr-cell@ayush.gov.in?subject=Ayurveda%20IP%20Facilitation%20Inquiry"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
              >
                Draft Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-page text-xs text-slate-400">
          Loading conversation...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
