"use client";

import type React from "react";
import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecruiterHeader from "../../components/recruiter/header";
import { toast, useSonner } from "sonner";


const RecruiterDetails: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    companySize: "",
    industry: "",
    designation: "",
    location: "",
    bio: "",
    logo: null as File | null,
  });

  

  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.info("File size must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.info("Please upload an image file");
        return;
      }
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.companyName.trim()) {
      toast.warning("Company name is required");
      return;
    }

    setIsSubmitting(true);

    const recruiterProfileData = {
      companyName: formData.companyName,
      companyWebsite: formData.companyWebsite || undefined,
      companySize: formData.companySize || undefined,
      industry: formData.industry || undefined,
      designation: formData.designation || undefined,
      location: formData.location || undefined,
      bio: formData.bio || undefined,
      subscriptionStatus: selectedPlan === "free" ? "free" : "active",
      jobPostsUsed: 0,
      verificationStatus: "pending",
    };

    
    try {
      console.log("Saving recruiter profile:", recruiterProfileData);

    
      toast.success("Profile created successfully!");
      navigate("/recruiter/");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Ideal for individual recruiters or small businesses.",
      features: ["1 Job Posting", "Basic Candidate Search", "Standard Support"],
      button: "Selected",
      isSelected: true,
      subscriptionStatus: "free" as const,
    },
    {
      id: "plus",
      name: "Plus",
      price: "$59",
      period: "/month",
      description: "Best for growing teams needing powerful recruitment tools.",
      features: [
        "Unlimited Job Posts",
        "Advanced Candidate Search",
        "AI Candidate Matching",
        "14-Day Free Trial",
      ],
      button: "Choose Plan",
      isSelected: false,
      badge: "MOST POPULAR",
      subscriptionStatus: "active" as const,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$149",
      period: "/month",
      description:
        "For enterprises seeking comprehensive, integrated solutions.",
      features: [
        "All Plus Features",
        "Dedicated Account Manager",
        "Priority Support",
        "API Access",
      ],
      button: "Choose Plan",
      isSelected: false,
      subscriptionStatus: "active" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-8">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-200 to-blue-100 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        {/* Use RecruiterHeader component */}
        <RecruiterHeader/>

        {/* Main content */}
        <div className="space-y-8 animate-slide-up">
          {/* Company form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two column layout */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g., Acme Corp"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., HR Manager, Talent Acquisition"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Bio field - Full width */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Bio / About Company
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your company, your mission, and what you're looking for..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Logo upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Logo Upload
                </label>
                <div className="relative border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-linear-to-b from-blue-50 to-transparent">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-sm text-slate-600">
                      Drag & drop your logo here, or{" "}
                      <span className="text-blue-500 font-medium">
                        click to browse
                      </span>
                      . Max 2MB.
                    </p>
                  </div>
                  {formData.logo && (
                    <p className="mt-3 text-sm font-medium text-green-600 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> {formData.logo.name}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Pricing plans - maps to subscriptionStatus in schema */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 text-center">
              Select Your Plan
            </h2>
            <p className="text-center text-slate-600">
              Your plan selection will determine your{" "}
              <span className="font-semibold">subscriptionStatus</span> in the
              system
            </p>

            <div className="grid grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? "bg-white border-2 border-blue-500 shadow-2xl scale-105"
                      : "bg-slate-50 border border-slate-200 hover:shadow-lg hover:border-slate-300"
                  }`}
                  style={{
                    animation: `slideUp 0.6s ease-out forwards`,
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-linear-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-slate-600 text-sm">{plan.description}</p>

                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-slate-900">
                        {plan.price}
                        <span className="text-lg text-slate-600 font-normal">
                          {plan.period}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Status: {plan.subscriptionStatus.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mt-6 ${
                        selectedPlan === plan.id
                          ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {selectedPlan === plan.id ? "Selected" : plan.button}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDetails;
