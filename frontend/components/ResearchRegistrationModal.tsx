"use client";

import React, { useState } from "react";
import { registerResearch } from "../lib/api";
import { ResearchRegistration } from "../lib/types";
import { X, ShieldCheck, Sparkles, CheckCircle2, Lock, ArrowRight, FileText, Building2 } from "lucide-react";

interface ResearchRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (registration: ResearchRegistration) => void;
}

export const ResearchRegistrationModal: React.FC<ResearchRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    herb_name: "",
    applicant_name: "",
    applicant_type: "Startup / DPIIT Recognized",
    stage: "Formulation & Standardization",
    claims_summary: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredResult, setRegisteredResult] = useState<ResearchRegistration | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.herb_name.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await registerResearch({
        title: formData.title.trim(),
        herb_name: formData.herb_name.trim(),
        applicant_name: formData.applicant_name.trim() || "Independent Innovator",
        applicant_type: formData.applicant_type,
        stage: formData.stage,
        claims_summary: formData.claims_summary.trim() || "Confidential proprietary extraction parameter.",
      });

      setRegisteredResult(result);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("Failed to register research:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setRegisteredResult(null);
    setFormData({
      title: "",
      herb_name: "",
      applicant_name: "",
      applicant_type: "Startup / DPIIT Recognized",
      stage: "Formulation & Standardization",
      claims_summary: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E3ECE6] relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleResetForm}
          className="absolute top-5 right-5 text-[#71867A] hover:text-[#15261D] p-1.5 rounded-xl hover:bg-[#F2F8F4] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF5EF] border border-[#A8D5BA] text-[#1B5E3A] flex items-center justify-center font-bold shadow-xs">
            <Lock className="w-6 h-6 text-[#2E7D5C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#15261D]">Innovation Pre-Registration</h3>
              <span className="text-[10px] font-mono font-bold bg-[#EAF5EF] text-[#1B5E3A] px-2 py-0.5 rounded-full border border-[#A8D5BA]">
                CONFIDENTIAL
              </span>
            </div>
            <p className="text-xs text-[#475D51]">
              Log formulation research to establish priority date and activate automatic RAG Conflict Checking
            </p>
          </div>
        </div>

        {registeredResult ? (
          /* Confirmation & Security Seal Card */
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-6 bg-[#EAF5EF] rounded-2xl border border-[#A8D5BA] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1B5E3A] text-white flex items-center justify-center mx-auto shadow-md shadow-[#1B5E3A]/20">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B5E3A]">
                  Priority Record Created & Secured
                </span>
                <h4 className="text-base font-extrabold text-[#15261D] mt-1">
                  Registration ID: {registeredResult.reg_id}
                </h4>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#A8D5BA]/60 text-left space-y-1.5 text-xs">
                <div>
                  <span className="text-[#71867A] text-[10px] uppercase font-bold block">Research Title</span>
                  <span className="font-semibold text-[#15261D]">{registeredResult.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[#71867A] text-[10px] uppercase font-bold block">Target Botanical</span>
                    <span className="font-medium text-[#1B5E3A]">{registeredResult.herb_name}</span>
                  </div>
                  <div>
                    <span className="text-[#71867A] text-[10px] uppercase font-bold block">Development Stage</span>
                    <span className="font-medium text-[#2E7D5C]">{registeredResult.stage}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E3ECE6]">
                  <span className="text-[#71867A] text-[10px] uppercase font-bold block">Cryptographic Audit Seal</span>
                  <span className="font-mono text-[10px] text-[#475D51] break-all">{registeredResult.security_hash}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#475D51] leading-relaxed pt-1">
                Your research is now logged in the local Conflict Checker. When any party queries similar botanical and therapeutic parameters, the RAG engine will issue a prior art warning.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#2E7D5C] hover:bg-[#1B5E3A] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Done & Return</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#15261D] mb-1">
                Research Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Sub-critical aqueous extract of Withania somnifera for neuroprotection"
                className="w-full px-3.5 py-2.5 bg-[#F7FAF8] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] focus:outline-none focus:ring-2 focus:ring-[#2E7D5C] focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#15261D] mb-1">
                  Primary Botanical / Herb <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.herb_name}
                  onChange={(e) => setFormData({ ...formData, herb_name: e.target.value })}
                  placeholder="e.g. Ashwagandha (Withania somnifera)"
                  className="w-full px-3.5 py-2.5 bg-[#F7FAF8] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] focus:outline-none focus:ring-2 focus:ring-[#2E7D5C] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15261D] mb-1">
                  Applicant Entity Name
                </label>
                <input
                  type="text"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  placeholder="e.g. VedicBio Labs / Dr. Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#F7FAF8] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] focus:outline-none focus:ring-2 focus:ring-[#2E7D5C] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#15261D] mb-1">
                  Entity Category
                </label>
                <select
                  value={formData.applicant_type}
                  onChange={(e) => setFormData({ ...formData, applicant_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7FAF8] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] focus:outline-none focus:ring-2 focus:ring-[#2E7D5C] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Startup / DPIIT Recognized">Startup / DPIIT Recognized</option>
                  <option value="Academic Research Institute">Academic Research Institute</option>
                  <option value="MSME Ayurvedic Manufacturer">MSME Ayurvedic Manufacturer</option>
                  <option value="Individual Innovator / Vaidya">Individual Innovator / Vaidya</option>
                  <option value="Corporate R&D">Corporate R&D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15261D] mb-1">
                  Stage of Research
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7FAF8] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] focus:outline-none focus:ring-2 focus:ring-[#2E7D5C] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Concept / Ideation">Concept / Ideation</option>
                  <option value="Formulation & Standardization">Formulation & Standardization</option>
                  <option value="In-Vitro / Bioavailability Testing">In-Vitro / Bioavailability Testing</option>
                  <option value="Pre-Clinical In-Vivo">Pre-Clinical In-Vivo</option>
                  <option value="Clinical Trial Phase I/II">Clinical Trial Phase I/II</option>
                  <option value="Provisional Patent Filed">Provisional Patent Filed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#15261D] mb-1">
                Formulation Novelty Summary & Section 3(p) Defense Strategy
              </label>
              <textarea
                rows={3}
                value={formData.claims_summary}
                onChange={(e) => setFormData({ ...formData, claims_summary: e.target.value })}
                placeholder="Briefly describe why this formulation exceeds prior art (e.g. non-obvious synergistic ratio, targeted microencapsulation, or zero-solvent extraction avoiding classical text rejection)..."
                className="w-full px-3.5 py-2.5 bg-[#F7FAF8] border border-[#A8D5BA] rounded-xl text-xs text-[#15261D] focus:outline-none focus:ring-2 focus:ring-[#2E7D5C] focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="pt-3 border-t border-[#E3ECE6] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-[#475D51]">
                <ShieldCheck className="w-4 h-4 text-[#4B9B6E]" />
                <span>Protected under Innovation Registry Ledger</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 text-xs font-semibold text-[#71867A] hover:text-[#15261D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.herb_name.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B5E3A] hover:bg-[#14462B] text-white text-xs font-bold shadow-md shadow-[#1B5E3A]/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Securing Record...</span>
                  ) : (
                    <>
                      <span>Pre-Register Innovation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResearchRegistrationModal;
