"use client";

import React from "react";
import { ClassificationType } from "../lib/types";

interface InlineClassifierProps {
  currentClassification?: ClassificationType | null;
  onSelect: (classification: ClassificationType) => void;
}

const OPTIONS: { id: ClassificationType; title: string; hint: string }[] = [
  {
    id: "Proprietary Medicine",
    title: "Proprietary Ayurvedic Medicine",
    hint: "Novel ratio, modern polyherbal blend, or classical modification",
  },
  {
    id: "Classical Medicine",
    title: "Classical Medicine (Shastriya)",
    hint: "Exact formula from 54 First Schedule compendia",
  },
  {
    id: "Phytopharmaceutical",
    title: "Phytopharmaceutical Drug",
    hint: "Purified bioactive fraction with min 4 active markers",
  },
  {
    id: "Ayurveda-Aahar",
    title: "Ayurveda-Aahar (Food/Supplement)",
    hint: "FSSAI 2022 dietary wellness regulations",
  },
  {
    id: "Cosmetic",
    title: "Ayush Cosmetic",
    hint: "Cleansing or topical beautification without disease claims",
  },
  {
    id: "New Drug",
    title: "New Chemical Drug / NCE",
    hint: "Synthetic derivative or chemical entity (CDSCO)",
  },
];

export const InlineClassifier: React.FC<InlineClassifierProps> = ({
  currentClassification,
  onSelect,
}) => {
  return (
    <div className="my-4 pl-4 border-l-2 border-slate-200 space-y-3 fade-in max-w-xl">
      <p className="text-sm font-medium text-slate-800">
        What type of formulation are you working with?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {OPTIONS.map((opt) => {
          const isSelected = currentClassification === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${
                isSelected
                  ? "border-blue-600 bg-blue-50/40 text-blue-900"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700"
              }`}
            >
              <div className="font-medium">{opt.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{opt.hint}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InlineClassifier;
