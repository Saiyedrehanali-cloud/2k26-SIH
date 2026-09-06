"use client";

import React, { useState } from "react";
import { UserCheck, X, Mail, Phone, ExternalLink, Send } from "lucide-react";

interface EscalationButtonProps {
  className?: string;
}

export const EscalationButton: React.FC<EscalationButtonProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    querySummary: "Need assistance with Ayurvedic formulation patentability & NBA Section 6 clearance.",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
    }, 2200);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-muted bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:border-gray-300 cursor-pointer ${className}`}
      >
        <UserCheck className="w-3.5 h-3.5 text-teal" />
        <span>Talk to an IP Facilitator</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-light text-teal flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-charcoal">Connect with an AYUSH IP Facilitator</h3>
                <p className="text-xs text-gray-500">Ministry of AYUSH Empanelled Patent Attorneys & TKDL Experts</p>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 bg-teal-light rounded-xl border border-teal-border text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-teal-dark">Consultation Request Dispatched</h4>
                <p className="text-xs text-teal-dark/80">
                  An empanelled IP facilitator will reach out to you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-charcoal mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-charcoal mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rajesh@ayush-startup.in"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-charcoal mb-1">Organization / Role</label>
                    <input
                      type="text"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      placeholder="Ayurveda Innovator"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-charcoal mb-1">Formulation / IPR Overview</label>
                  <textarea
                    rows={3}
                    value={formData.querySummary}
                    onChange={(e) => setFormData({ ...formData, querySummary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href="mailto:ip-sakti-helpdesk@ayush.gov.in"
                    className="text-[11px] text-gray-500 hover:text-teal flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Direct Helpdesk Email</span>
                  </a>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-hover text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EscalationButton;
