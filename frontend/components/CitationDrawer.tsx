"use client";

import React, { useState } from "react";
import { Citation } from "../lib/types";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Bookmark } from "lucide-react";

interface CitationDrawerProps {
  citations: Citation[];
  defaultExpanded?: boolean;
  className?: string;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  citations,
  defaultExpanded = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className={`mt-3 pt-3 border-t border-[#E3ECE6] ${className}`}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 px-3 bg-[#F2F8F4] hover:bg-[#EAF5EF] rounded-xl text-xs font-semibold text-[#1B5E3A] transition-colors cursor-pointer border border-[#A8D5BA]/70"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-[#2E7D5C]" />
          <span>
            {citations.length} {citations.length === 1 ? "Verified Legal Citation" : "Verified Legal Citations"}
          </span>
          <span className="text-[10px] bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] px-2 py-0.5 rounded-full font-mono font-bold">
            STATUTE-BACKED
          </span>
        </span>
        <span className="flex items-center gap-1 text-[#475D51]">
          <span className="text-[11px] font-normal">{isExpanded ? "Collapse" : "Inspect Sources"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#2E7D5C]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2E7D5C]" />}
        </span>
      </button>

      {/* Expanded list */}
      {isExpanded && (
        <div className="mt-2.5 space-y-2">
          {citations.map((citation, index) => (
            <div
              key={`${citation.ref_id}-${index}`}
              className="p-3.5 bg-white rounded-xl border border-[#E3ECE6] shadow-sm flex flex-col gap-1.5 transition-all hover:border-[#6BBF8A]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-[#4B9B6E] flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#15261D] font-sans">
                    {citation.source}
                  </span>
                </div>
                {citation.url && (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#2E7D5C] hover:text-[#1B5E3A] font-semibold underline flex-shrink-0"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#71867A]">Ref ID:</span>
                <span className="text-[11px] font-mono font-bold text-[#1B5E3A] bg-[#EAF5EF] px-2.5 py-0.5 rounded-md border border-[#A8D5BA]">
                  {citation.ref_id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitationDrawer;
