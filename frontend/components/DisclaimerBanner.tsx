import React from "react";
import { AlertTriangle } from "lucide-react";

interface DisclaimerBannerProps {
  customText?: string;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  customText,
  className = "",
}) => {
  return (
    <aside
      aria-label="Legal Disclaimer"
      className={`flex items-start sm:items-center gap-2.5 px-3.5 sm:px-4 py-2 bg-[#F2F8F4] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] shadow-xs ${className}`}
    >
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#EAF5EF] border border-[#A8D5BA] flex items-center justify-center text-[#2E7D5C] font-bold mt-0.5 sm:mt-0">
        <AlertTriangle className="w-3 h-3 text-[#2E7D5C]" />
      </div>
      <p className="flex-1 font-medium leading-relaxed text-[#15261D] text-[11px] sm:text-xs">
        <strong className="text-[#1B5E3A] font-bold">Important Regulatory Notice: </strong>
        {customText ||
          "This tool provides statutory informational guidance, not binding legal advice. Consult a registered patent attorney or AYUSH IP facilitator before commercial filing."}
      </p>
      <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#1B5E3A] border border-[#A8D5BA] flex-shrink-0">
        Statutory Pre-Screening
      </span>
    </aside>
  );
};

export default DisclaimerBanner;
