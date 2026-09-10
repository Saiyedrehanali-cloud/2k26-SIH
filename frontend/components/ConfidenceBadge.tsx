import React from "react";
import { ConfidenceLevel } from "../lib/types";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level,
  className = "",
}) => {
  const configs = {
    high: {
      label: "High Confidence",
      icon: CheckCircle2,
      containerClasses: "bg-[#EAF5EF] text-[#1B5E3A] border-[#A8D5BA]",
      dotClass: "bg-[#2E7D5C]",
    },
    medium: {
      label: "Medium Confidence",
      icon: AlertCircle,
      containerClasses: "bg-[#F2F8F4] text-[#2E7D5C] border-[#6BBF8A]",
      dotClass: "bg-[#4B9B6E]",
    },
    low: {
      label: "Low Confidence (Flagged)",
      icon: AlertTriangle,
      containerClasses: "bg-amber-50 text-amber-800 border-amber-300",
      dotClass: "bg-amber-600",
    },
  };

  const config = configs[level] || configs.medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.containerClasses} ${className}`}
      title={`Retrieval certainty: ${config.label}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export default ConfidenceBadge;
