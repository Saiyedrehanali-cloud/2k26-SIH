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
      className={`inline-flex items-center p-1.5 bg-gray-100/90 rounded-2xl border border-gray-200 shadow-inner ${className}`}
      role="radiogroup"
      aria-label="Active Legal Jurisdiction Corpus"
    >
      {/* India Button */}
      <button
        type="button"
        role="radio"
        aria-checked={isIndia}
        onClick={() => onJurisdictionChange("india")}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 ${
          isIndia
            ? "bg-white text-orange shadow-md shadow-orange/10 border-2 border-orange font-bold scale-[1.02]"
            : "text-gray-500 hover:text-gray-700 opacity-60 hover:opacity-90 border-2 border-transparent"
        }`}
      >
        <ShieldCheck className={`w-4 h-4 ${isIndia ? "text-orange" : "text-gray-400"}`} />
        <span>India (AYUSH / Patents Act)</span>
        {isIndia && (
          <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
        )}
      </button>

      {/* International Button */}
      <button
        type="button"
        role="radio"
        aria-checked={!isIndia}
        onClick={() => onJurisdictionChange("international")}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 ${
          !isIndia
            ? "bg-white text-orange shadow-md shadow-orange/10 border-2 border-orange font-bold scale-[1.02]"
            : "text-gray-500 hover:text-gray-700 opacity-60 hover:opacity-90 border-2 border-transparent"
        }`}
      >
        <Globe className={`w-4 h-4 ${!isIndia ? "text-orange" : "text-gray-400"}`} />
        <span>International (TRIPS / Nagoya)</span>
        {!isIndia && (
          <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default JurisdictionToggle;
