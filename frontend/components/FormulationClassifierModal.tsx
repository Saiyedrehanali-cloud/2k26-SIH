"use client";

import React, { useState } from "react";
import { ClassificationResult, ClassificationType } from "../lib/types";
import { classifyFormulation } from "../lib/api";
import { X, CheckCircle, ArrowRight, ArrowLeft, RotateCcw, Sparkles, FileText, Loader2 } from "lucide-react";

interface FormulationClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassificationComplete: (result: ClassificationResult) => void;
}

interface Question {
  id: string;
  title: string;
  description: string;
  options: { label: string; value: string; hint?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "source_formula",
    title: "1. Is this formulation derived directly from authoritative classical Ayurvedic texts?",
    description: "Refer to the First Schedule of the Drugs and Cosmetics Act, 1940 (e.g., Charaka Samhita, Sushruta Samhita, AFI).",
    options: [
      { label: "Yes, exactly matching classical references", value: "classical_exact", hint: "Identical ingredients and traditional preparation method" },
      { label: "Modified classical recipe / novel ratio", value: "classical_modified", hint: "Classical botanicals with modern synergistic ratios or extraction" },
      { label: "No, novel polyherbal combination", value: "novel_polyherbal", hint: "Created entirely by innovator or research team" },
    ],
  },
  {
    id: "chemical_fraction",
    title: "2. Does the formulation contain purified isolate fractions or standardized phytopharmaceutical extracts?",
    description: "Standardization of active chemical moieties determines the regulatory pathway under DCGI / AYUSH.",
    options: [
      { label: "Whole botanical extracts / traditional decoction (Kwath/Churna/Asava)", value: "whole_botanical" },
      { label: "Purified bioactive fraction (e.g. >95% pure standardized marker)", value: "purified_fraction" },
      { label: "Synthetic or chemically altered analog", value: "synthetic_analog" },
    ],
  },
  {
    id: "intended_use",
    title: "3. What is the intended commercial use and labeling claim?",
    description: "Regulatory drug scheduling strictly depends on therapeutic vs. wellness indications.",
    options: [
      { label: "Therapeutic cure or disease treatment (ASU Drug)", value: "medicine" },
      { label: "Daily dietary / nutritional wellness (Ayurveda Aahar)", value: "food" },
      { label: "Topical cosmetic / dermatological application", value: "cosmetic" },
    ],
  },
  {
    id: "prior_art",
    title: "4. Has the ingredient combination appeared in any TKDL prior art record?",
    description: "TKDL (Traditional Knowledge Digital Library) records can preempt novelty under Section 3(p).",
    options: [
      { label: "Documented in TKDL / public folklore", value: "tkdl_present" },
      { label: "Not found in TKDL / Novel research discovery", value: "tkdl_absent" },
      { label: "Uncertain / Search not yet conducted", value: "tkdl_uncertain" },
    ],
  },
];

export const FormulationClassifierModal: React.FC<FormulationClassifierModalProps> = ({
  isOpen,
  onClose,
  onClassificationComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsEvaluating(true);
      try {
        const computedResult = await classifyFormulation(answers);
        setResult(computedResult);
      } catch (err) {
        console.error("Classification error:", err);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  const handleApplyResult = () => {
    if (result) {
      onClassificationComplete(result);
      onClose();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  const currentQ = QUESTIONS[currentStep];
  const selectedAnswer = answers[currentQ?.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#1B5E3A] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#4B9B6E]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#15261D]">Ayurvedic Formulation Classifier</h3>
            <p className="text-xs text-[#475D51]">Statutory categorization under Drugs & Cosmetics Act & Patents Act</p>
          </div>
        </div>

        {/* Progress Bar */}
        {!result && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#71867A] font-medium mb-1.5">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span className="font-bold text-[#1B5E3A]">{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-[#E3ECE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4B9B6E] to-[#2E7D5C] transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question View */}
        {!result ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-[#15261D] leading-snug">{currentQ.title}</h4>
              <p className="text-xs text-[#475D51] mt-1">{currentQ.description}</p>
            </div>

            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswer === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.value)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#1B5E3A] bg-[#EAF5EF] shadow-xs"
                        : "border-[#E3ECE6] hover:border-[#A8D5BA] bg-white hover:bg-[#F7FAF8]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? "text-[#1B5E3A] font-bold" : "text-[#15261D]"}`}>
                        {opt.label}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-[#1B5E3A] bg-[#1B5E3A] text-white" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    {opt.hint && <p className="text-[11px] text-[#71867A] mt-1">{opt.hint}</p>}
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E3ECE6]">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#475D51] hover:text-[#15261D] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!selectedAnswer || isEvaluating}
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B5E3A] hover:bg-[#14462B] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Rules...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === QUESTIONS.length - 1 ? "Evaluate Classification" : "Next Question"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 bg-[#EAF5EF] rounded-2xl border border-[#A8D5BA] text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B5E3A]">
                Statutory Determination
              </span>
              <div className="inline-block px-4 py-1.5 bg-white text-[#1B5E3A] rounded-full font-bold text-base shadow-sm border border-[#A8D5BA]">
                {result.classification}
              </div>
              <p className="text-xs text-[#475D51] leading-relaxed pt-2 text-left">
                {result.explanation}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E3ECE6]">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-[#475D51] hover:text-[#15261D] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change Answers</span>
              </button>

              <button
                type="button"
                onClick={handleApplyResult}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2E7D5C] hover:bg-[#1B5E3A] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <span>Continue to Chat with Context</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulationClassifierModal;
