"use client";

import React from "react";
import { ChatMessage } from "../lib/types";
import CitationDrawer from "./CitationDrawer";
import ConfidenceBadge from "./ConfidenceBadge";
import { Bot, User, AlertOctagon, PhoneCall, Shield } from "lucide-react";

interface ChatBubbleProps {
  message: ChatMessage;
  onEscalate?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onEscalate }) => {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end my-4">
        <div className="flex items-start gap-3 max-w-2xl">
          <div className="flex flex-col items-end">
            <div className="bg-[#1B5E3A] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm leading-relaxed text-sm font-medium">
              {message.text}
            </div>
            <span className="text-[11px] text-[#71867A] mt-1 mr-1">{message.timestamp}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#EAF5EF] border border-[#A8D5BA] flex items-center justify-center text-[#1B5E3A] flex-shrink-0 mt-0.5 shadow-xs">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  // Low-Confidence / Refusal state card (per ui_ux_guidelines.md §4.4)
  if (message.isRefusal || message.confidence === "low") {
    return (
      <div className="flex justify-start my-4">
        <div className="flex items-start gap-3 max-w-3xl w-full">
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0 mt-1 shadow-xs">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="bg-white border-2 border-dashed border-[#4B9B6E]/70 rounded-2xl p-5 shadow-bento space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E3ECE6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1B5E3A] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#4B9B6E]" />
                    Regulatory Guardrail Triggered
                  </span>
                </div>
                <ConfidenceBadge level="low" />
              </div>

              {/* Body */}
              <p className="text-sm text-[#15261D] leading-relaxed">
                {message.text}
              </p>

              {/* Safety notice callout */}
              <div className="p-3 bg-[#F2F8F4] rounded-xl border border-[#A8D5BA]/80 text-xs text-[#15261D]">
                <p className="font-bold text-[#1B5E3A] mb-1">Zero-Hallucination Policy Notice:</p>
                <p className="text-[#475D51]">
                  Vigyan Veda blocks AI generation when verifiable statutory citations cannot be confirmed in the active jurisdiction corpus.
                </p>
              </div>

              {/* Escalation Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#475D51] font-medium">
                  Need a binding legal assessment?
                </span>
                <button
                  type="button"
                  onClick={onEscalate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B5E3A] hover:bg-[#14462B] text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Consult an IP Facilitator</span>
                </button>
              </div>
            </div>
            <span className="text-[11px] text-[#71867A] mt-1 ml-1 inline-block">{message.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard verified assistant card
  return (
    <div className="flex justify-start my-4">
      <div className="flex items-start gap-3 max-w-3xl w-full">
        <div className="w-8 h-8 rounded-full bg-white border border-[#A8D5BA] flex items-center justify-center p-0.5 flex-shrink-0 mt-1 shadow-xs overflow-hidden">
          <img src="/logo.png" alt="Vigyan Veda" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <div className="bg-card border border-[#E3ECE6] rounded-2xl p-5 shadow-bento space-y-3">
            {/* Top metadata row */}
            <div className="flex items-center justify-between border-b border-[#E3ECE6] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1B5E3A] tracking-wide flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#2E7D5C]" />
                  Vigyan Veda Legal Assessment
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] font-bold">
                  {message.jurisdiction === "india" ? "Jurisdiction: India" : "Jurisdiction: International"}
                </span>
              </div>
              {message.confidence && <ConfidenceBadge level={message.confidence} />}
            </div>

            {/* Conflict Alert Warning Card (Innovation Registry & Conflict Checker) */}
            {message.conflictAlert && message.conflictAlert.has_conflict && (
              <div className="bg-amber-50/90 border-2 border-amber-400/90 rounded-xl p-3.5 space-y-2.5 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                      <AlertOctagon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Conflict Alert: Pending Prior Art Pre-Registration
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                    {message.conflictAlert.conflict_count} Matching Entity
                  </span>
                </div>

                <div className="space-y-2">
                  {message.conflictAlert.conflicts.map((conflict, cIdx) => (
                    <div key={cIdx} className="bg-white/90 p-2.5 rounded-lg border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#15261D]">{conflict.title}</span>
                        <span className="font-mono font-bold text-[10px] bg-[#EAF5EF] text-[#1B5E3A] px-2 py-0.5 rounded border border-[#A8D5BA] flex-shrink-0">
                          {conflict.reg_id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#475D51]">
                        <span><strong>Applicant:</strong> {conflict.applicant_name} ({conflict.applicant_type})</span>
                        <span>•</span>
                        <span><strong>Stage:</strong> {conflict.stage}</span>
                      </div>
                      <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200/60 font-medium">
                        ⚠️ <strong>Overlap Reason:</strong> {conflict.conflict_reason}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-amber-900 leading-snug">
                  <strong>Statutory Notice:</strong> Another entity has pre-registered overlapping research in the AYUSH Innovation Registry. Proceeding with an identical patent filing risks Section 3(p) prior art objections and priority contest under Indian patent prosecution.
                </p>
              </div>
            )}

            {/* Answer prose */}
            <div className="text-sm text-[#15261D] leading-relaxed whitespace-pre-line font-normal">
              {message.text}
            </div>

            {/* Citations Drawer (FR3: rendered as a distinct visual element, separated by a divider) */}
            {message.citations && message.citations.length > 0 && (
              <CitationDrawer citations={message.citations} />
            )}

            {/* Server-injected disclaimer */}
            {message.disclaimer && (
              <div className="pt-2 text-[11px] text-gray-400 italic border-t border-gray-100">
                {message.disclaimer}
              </div>
            )}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 ml-1 inline-block">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
