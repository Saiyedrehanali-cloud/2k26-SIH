"use client";

import React, { useState } from "react";
import { ChatMessage } from "../lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
  onEscalate?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onEscalate }) => {
  const isUser = message.sender === "user";
  const [showCitations, setShowCitations] = useState(false);

  // 1. User Message: light gray pill, plain text, no bold elements
  if (isUser) {
    return (
      <div className="flex justify-end my-3 fade-in">
        <div className="bg-slate-100 text-slate-900 px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed font-normal">
          {message.text}
        </div>
      </div>
    );
  }

  // 2. Low-Confidence / Refusal state: honest plain text, no dashed borders or decorative cards
  if (message.isRefusal || message.confidence === "low") {
    return (
      <div className="flex justify-start my-5 fade-in">
        <div className="border-l-2 border-slate-200 pl-4 py-0.5 space-y-2 max-w-2xl w-full text-slate-900 text-sm leading-relaxed">
          <p>
            {message.text || "I don't have a confident source for this — you may want to consult a facilitator."}
          </p>
          <div>
            <button
              type="button"
              onClick={onEscalate}
              className="text-xs text-blue-600 hover:text-blue-700 underline cursor-pointer"
            >
              Talk to a facilitator
            </button>
          </div>
        </div>
      </div>
    );
  }

  const citationsCount = message.citations ? message.citations.length : 0;
  const confidenceLabel = message.confidence ? `${message.confidence} confidence` : "high confidence";

  // 3. Standard Assistant Message: plain text with subtle left border, single quiet line of sources
  return (
    <div className="flex justify-start my-5 fade-in">
      <div className="border-l-2 border-slate-200 pl-4 py-0.5 space-y-2 max-w-2xl w-full text-slate-900 text-sm leading-relaxed">
        <div className="whitespace-pre-line text-slate-900 font-normal">
          {message.text}
        </div>

        {/* Single small line of muted gray text replacing drawer + badge */}
        {citationsCount > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowCitations(!showCitations)}
              className="text-xs text-slate-500 hover:text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1.5 select-none"
            >
              <span>{citationsCount} {citationsCount === 1 ? "source" : "sources"} · {confidenceLabel}</span>
              <span className="text-[10px] text-slate-400">{showCitations ? "▴" : "▾"}</span>
            </button>

            {showCitations && (
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2">
                {message.citations!.map((c, idx) => (
                  <li key={idx} className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 select-none">•</span>
                    <span>
                      {c.source}
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline ml-1.5"
                        >
                          link
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
