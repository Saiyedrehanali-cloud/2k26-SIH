"use client";

import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface DisclaimerBannerProps {
  customText?: string;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  customText,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultNotice =
    "This tool provides statutory informational guidance, not binding legal advice. Consult a registered patent attorney or AYUSH IP facilitator before commercial filing.";

  return (
    <aside
      aria-label="Regulatory Notice"
      className={`bg-[#F2F8F4] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] shadow-xs transition-all ${className}`}
    >
      <div
        className="flex sm:hidden items-center justify-between px-3 py-1.5 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-[#2E7D5C] flex-shrink-0" />
          <span className="text-[11px] font-semibold text-[#1B5E3A] truncate">
            Notice: Statutory guidance only
          </span>
        </div>
        <button type="button" className="p-0.5 text-[#2E7D5C]">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="sm:hidden px-3 pb-2 pt-1 border-t border-[#A8D5BA]/40 text-[11px] leading-relaxed text-[#475D51]">
          {customText || defaultNotice}
        </div>
      )}

      <div className="hidden sm:flex items-center gap-2.5 px-4 py-2">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#EAF5EF] border border-[#A8D5BA] flex items-center justify-center text-[#2E7D5C]">
          <AlertTriangle className="w-3 h-3 text-[#2E7D5C]" />
        </div>
        <p className="flex-1 font-medium leading-relaxed text-[#15261D] text-xs">
          <strong className="text-[#1B5E3A]">Important Regulatory Notice: </strong>
          {customText || defaultNotice}
        </p>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] flex-shrink-0">
          Statutory Pre-Screening
        </span>
      </div>
    </aside>
  );
};

export default DisclaimerBanner;
