"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col justify-between px-6 py-12 selection:bg-blue-100">
      {/* Top minimal title mark */}
      <header className="max-w-xl w-full mx-auto">
        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
          IP-SAKTI Sahayak
        </span>
      </header>

      {/* Center: Single focused prompt area */}
      <main className="max-w-xl w-full mx-auto my-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Ayurveda IP & Patent Guidance
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed font-normal">
            Ask statutory questions on Section 3(p), Biological Diversity Act clearance, or formulation licensing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative pt-2">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about IP, patents, or regulatory guidance..."
              className="w-full px-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={!query.trim()}
              aria-label="Send"
              className="mr-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity cursor-pointer flex-shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Small one-line muted disclaimer */}
        <p className="text-xs text-slate-400 text-center font-normal">
          Informational legal guidance derived from statutory texts, not formal legal advice.
        </p>
      </main>

      {/* Quiet bottom metadata */}
      <footer className="max-w-xl w-full mx-auto text-xs text-slate-400 flex items-center justify-between">
        <span>Ministry of Ayush · SIH26045</span>
        <button
          type="button"
          onClick={() => router.push("/chat")}
          className="hover:text-slate-600 transition-colors cursor-pointer"
        >
          Open conversation →
        </button>
      </footer>
    </div>
  );
}
