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
      containerClasses: "bg-green-50 text-green-700 border-green-200",
      dotClass: "bg-green-600",
    },
    medium: {
      label: "Medium Confidence",
      icon: AlertCircle,
      containerClasses: "bg-amber-50 text-amber-700 border-amber-200",
      dotClass: "bg-amber-600",
    },
    low: {
      label: "Low Confidence (Flagged)",
      icon: AlertTriangle,
      containerClasses: "bg-orange-50 text-orange-700 border-orange-300",
      dotClass: "bg-orange-600",
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
