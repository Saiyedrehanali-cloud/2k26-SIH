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
    <div className={`mt-3 pt-3 border-t border-gray-100 ${className}`}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-1.5 px-3 bg-gray-50/80 hover:bg-gray-100/80 rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer border border-gray-200/60"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-teal" />
          <span>
            {citations.length} {citations.length === 1 ? "Verified Legal Citation" : "Verified Legal Citations"}
          </span>
          <span className="text-[10px] bg-teal-light text-teal border border-teal-border px-1.5 py-0.2 rounded font-mono font-bold">
            STATUTE-BACKED
          </span>
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <span className="text-[11px] font-normal">{isExpanded ? "Collapse" : "Inspect Sources"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>

      {/* Expanded list */}
      {isExpanded && (
        <div className="mt-2.5 space-y-2">
          {citations.map((citation, index) => (
            <div
              key={`${citation.ref_id}-${index}`}
              className="p-3 bg-white rounded-lg border border-gray-200/80 shadow-sm flex flex-col gap-1.5 transition-all hover:border-teal/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-teal flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-charcoal font-sans">
                    {citation.source}
                  </span>
                </div>
                {citation.url && (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-teal hover:text-teal-hover font-medium underline flex-shrink-0"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Ref ID:</span>
                <span className="text-[11px] font-mono font-medium text-charcoal-muted bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
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
