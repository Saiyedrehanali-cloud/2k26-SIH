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
      className={`flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto p-1 bg-[#EEF5F1] rounded-2xl border border-[#D6E7DC] gap-1 shadow-inner ${className}`}
      role="radiogroup"
      aria-label="Active Regulatory Jurisdiction"
    >
      <button
        type="button"
        role="radio"
        aria-checked={isIndia}
        onClick={() => onJurisdictionChange("india")}
        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          isIndia
            ? "bg-white text-[#1B5E3A] shadow-xs border border-[#A8D5BA] font-bold"
            : "text-[#475D51] hover:text-[#15261D] opacity-80 hover:opacity-100"
        }`}
      >
        <ShieldCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isIndia ? "text-[#1B5E3A]" : "text-gray-400"}`} />
        <span className="text-xs sm:text-sm">India (AYUSH / Patents Act)</span>
        {isIndia && <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5C] animate-pulse" />}
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={!isIndia}
        onClick={() => onJurisdictionChange("international")}
        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          !isIndia
            ? "bg-white text-[#1B5E3A] shadow-xs border border-[#A8D5BA] font-bold"
            : "text-[#475D51] hover:text-[#15261D] opacity-80 hover:opacity-100"
        }`}
      >
        <Globe className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${!isIndia ? "text-[#1B5E3A]" : "text-gray-400"}`} />
        <span className="text-xs sm:text-sm">International (TRIPS / Nagoya)</span>
        {!isIndia && <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5C] animate-pulse" />}
      </button>
    </div>
  );
};

export default JurisdictionToggle;
