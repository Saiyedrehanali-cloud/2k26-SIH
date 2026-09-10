"use client";

import React from "react";
import { Jurisdiction } from "../lib/types";
import { Globe, ShieldCheck } from "lucide-react";

interface JurisdictionToggleProps {
  currentJurisdiction: Jurisdiction;
  onJurisdictionChange: (jurisdiction: Jurisdiction) => void;
  className?: string;
}

export const JurisdictionToggle: React.FC<JurisdictionToggleProps> = ({
  currentJurisdiction,
  onJurisdictionChange,
  className = "",
}) => {
  const isIndia = currentJurisdiction === "india";

  return (
    <div
      className={`inline-flex items-center p-1.5 bg-[#EEF5F1] rounded-2xl border border-[#D6E7DC] shadow-inner ${className}`}
      role="radiogroup"
      aria-label="Active Legal Jurisdiction Corpus"
    >
      {/* India Button */}
      <button
        type="button"
        role="radio"
        aria-checked={isIndia}
        onClick={() => onJurisdictionChange("india")}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-palette-pine focus:ring-offset-2 ${
          isIndia
            ? "bg-white text-palette-pine shadow-md shadow-palette-pine/10 border-2 border-palette-pine font-bold scale-[1.02]"
            : "text-charcoal-muted hover:text-charcoal opacity-70 hover:opacity-100 border-2 border-transparent"
        }`}
      >
        <ShieldCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isIndia ? "text-palette-pine" : "text-gray-400"}`} />
        <span className="hidden sm:inline">India (AYUSH / Patents Act)</span>
        <span className="sm:hidden">India (AYUSH)</span>
        {isIndia && (
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-palette-herbal animate-pulse" />
        )}
      </button>

      {/* International Button */}
      <button
        type="button"
        role="radio"
        aria-checked={!isIndia}
        onClick={() => onJurisdictionChange("international")}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-palette-pine focus:ring-offset-2 ${
          !isIndia
            ? "bg-white text-palette-pine shadow-md shadow-palette-pine/10 border-2 border-palette-pine font-bold scale-[1.02]"
            : "text-charcoal-muted hover:text-charcoal opacity-70 hover:opacity-100 border-2 border-transparent"
        }`}
      >
        <Globe className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${!isIndia ? "text-palette-pine" : "text-gray-400"}`} />
        <span className="hidden sm:inline">International (TRIPS / Nagoya)</span>
        <span className="sm:hidden">International</span>
        {!isIndia && (
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-palette-herbal animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default JurisdictionToggle;
