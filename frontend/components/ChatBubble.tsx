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
            <div className="bg-teal text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm leading-relaxed text-sm font-medium">
              {message.text}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 mr-1">{message.timestamp}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-light border border-teal-border flex items-center justify-center text-teal flex-shrink-0 mt-0.5">
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
          <div className="w-8 h-8 rounded-full bg-orange-light border border-orange/40 flex items-center justify-center text-orange flex-shrink-0 mt-1">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="bg-white border-2 border-dashed border-orange/60 rounded-2xl p-5 shadow-bento space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-orange/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Regulatory Guardrail Triggered
                  </span>
                </div>
                <ConfidenceBadge level="low" />
              </div>

              {/* Body */}
              <p className="text-sm text-charcoal leading-relaxed">
                {message.text}
              </p>

              {/* Safety notice callout */}
              <div className="p-3 bg-orange-light/80 rounded-xl border border-orange/30 text-xs text-charcoal">
                <p className="font-semibold text-orange-hover mb-1">Zero-Hallucination Policy Notice:</p>
                <p className="text-gray-600">
                  IP-SAKTI Sahayak blocks AI generation when verifiable statutory citations cannot be confirmed in the active jurisdiction corpus.
                </p>
              </div>

              {/* Escalation Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  Need a binding legal assessment?
                </span>
                <button
                  type="button"
                  onClick={onEscalate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white hover:bg-orange-hover text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Consult an IP Facilitator</span>
                </button>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 mt-1 ml-1 inline-block">{message.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard verified assistant card
  return (
    <div className="flex justify-start my-4">
      <div className="flex items-start gap-3 max-w-3xl w-full">
        <div className="w-8 h-8 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center text-teal flex-shrink-0 mt-1">
          <Bot className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-bento space-y-3">
            {/* Top metadata row */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal tracking-wide flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal" />
                  IP-SAKTI Legal Assessment
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                  {message.jurisdiction === "india" ? "Jurisdiction: India" : "Jurisdiction: International"}
                </span>
              </div>
              {message.confidence && <ConfidenceBadge level={message.confidence} />}
            </div>

            {/* Answer prose */}
            <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line font-normal">
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
