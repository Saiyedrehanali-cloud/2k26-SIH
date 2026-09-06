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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-light text-orange flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal">Ayurvedic Formulation Classifier</h3>
            <p className="text-xs text-gray-500">Statutory categorization under Drugs & Cosmetics Act & Patents Act</p>
          </div>
        </div>

        {/* Progress Bar */}
        {!result && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 font-medium mb-1.5">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question View */}
        {!result ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-charcoal leading-snug">{currentQ.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{currentQ.description}</p>
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
                        ? "border-2 border-orange bg-orange-light/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? "text-orange-hover" : "text-charcoal"}`}>
                        {opt.label}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-orange bg-orange text-white" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    {opt.hint && <p className="text-[11px] text-gray-400 mt-1">{opt.hint}</p>}
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!selectedAnswer || isEvaluating}
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange hover:bg-orange-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
            <div className="p-5 bg-teal-light rounded-2xl border border-teal-border text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                Statutory Determination
              </span>
              <div className="inline-block px-4 py-1.5 bg-white text-teal rounded-full font-bold text-base shadow-sm border border-teal/20">
                {result.classification}
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed pt-2 text-left">
                {result.explanation}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change Answers</span>
              </button>

              <button
                type="button"
                onClick={handleApplyResult}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal hover:bg-teal-hover text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
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
