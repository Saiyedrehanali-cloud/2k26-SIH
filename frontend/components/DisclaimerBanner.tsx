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
      className={`flex items-center gap-2.5 px-4 py-2 bg-orange-light border border-orange/40 rounded-xl text-xs text-charcoal shadow-sm ${className}`}
    >
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange/15 flex items-center justify-center text-orange font-bold">
        <AlertTriangle className="w-3.5 h-3.5 text-orange" />
      </div>
      <p className="flex-1 font-medium leading-relaxed">
        <strong className="text-orange-hover font-semibold">Important Regulatory Notice: </strong>
        {customText ||
          "This tool provides statutory informational guidance, not binding legal advice. Consult a registered patent attorney or AYUSH IP facilitator before commercial filing."}
      </p>
      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange/15 text-orange">
        Statutory Pre-Screening
      </span>
    </aside>
  );
};

export default DisclaimerBanner;
