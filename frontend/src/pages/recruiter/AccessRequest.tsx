"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const AccessRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    recruiterPurpose: "",
    officialEmail: "",
    invitationCode: "",
  })

  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-12 flex items-center justify-center">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-200 to-blue-100 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="relative w-full max-w-2xl px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 p-2 hover:bg-slate-100 rounded-lg transition-colors inline-block"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Access Request</h1>
            <p className="text-slate-600">Request early access to RecruitFlow AI</p>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Our team will review your request. You will be contacted within 24-48 hours.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Organization Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Recruiter Purpose */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">Recruiter purpose</label>
              <textarea
                name="recruiterPurpose"
                value={formData.recruiterPurpose}
                onChange={handleInputChange}
                placeholder="Describe your primary responsibilities and how you plan to use..."
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Official Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">Official Email</label>
              <input
                type="email"
                name="officialEmail"
                value={formData.officialEmail}
                onChange={handleInputChange}
                placeholder="corporate@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Invitation Code */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Invitation Code <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="invitationCode"
                value={formData.invitationCode}
                onChange={handleInputChange}
                placeholder="XYZ123"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Buttons */}
          <div className="flex gap-4 pt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button className="flex-1 py-3 px-4 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
