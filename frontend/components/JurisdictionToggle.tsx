"use client";

import React, { useState, useRef, useEffect } from "react";
import { Jurisdiction } from "../lib/types";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const label = currentJurisdiction === "india" ? "India" : "International";

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors focus:outline-none cursor-pointer py-1 px-2 rounded-md hover:bg-slate-100"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <span className="text-xs text-slate-400 select-none">▾</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-44 rounded-lg bg-white border border-slate-200 shadow-sm py-1 z-50 text-xs">
          <button
            type="button"
            onClick={() => {
              onJurisdictionChange("india");
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
              currentJurisdiction === "india"
                ? "text-blue-600 font-medium bg-slate-50"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>India</span>
            {currentJurisdiction === "india" && <span className="text-blue-600 font-bold">✓</span>}
          </button>
          <button
            type="button"
            onClick={() => {
              onJurisdictionChange("international");
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
              currentJurisdiction === "international"
                ? "text-blue-600 font-medium bg-slate-50"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>International</span>
            {currentJurisdiction === "international" && <span className="text-blue-600 font-bold">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default JurisdictionToggle;
