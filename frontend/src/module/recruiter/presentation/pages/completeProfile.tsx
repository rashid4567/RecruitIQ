"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Upload, Check, Building, Globe, Users, Briefcase, MapPin, FileText, Sparkles, Shield, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { completeProfileUC } from "../di/recruiter.di";
import { RecruiterProfile } from "../../Domain/entities/recruiterEntities";

interface FormData {
  companyName: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  designation: string;
  location: string;
  bio: string;
  logo: File | null;
}

const RecruiterDetails: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyWebsite: "",
    companySize: "",
    industry: "",
    designation: "",
    location: "",
    bio: "",
    logo: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [selectedPlan, setSelectedPlan] = useState<"free" | "active">("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const requiredFields: (keyof FormData)[] = [
      "companyName",
      "industry",
      "designation",
      "bio",
    ];

    const filledCount = requiredFields.filter((field) => {
      const value = formData[field];
      return (
        typeof value === "string" &&
        value.trim().length > 0
      );
    }).length;

    const progressPercentage = (filledCount / requiredFields.length) * 100;
    setProgress(progressPercentage);
  }, [formData]);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "companyName":
        if (!value.trim()) return "Company name is required";
        if (value.length < 2) return "Company name must be at least 2 characters";
        if (value.length > 100) return "Company name must be less than 100 characters";
        return "";

      case "companyWebsite":
        if (value && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)) {
          return "Please enter a valid website URL";
        }
        return "";

      case "industry":
        if (!value.trim()) return "Industry is required";
        return "";

      case "designation":
        if (!value.trim()) return "Designation is required";
        if (value.length > 100) return "Designation must be less than 100 characters";
        return "";

      case "bio":
        if (!value.trim()) return "Company bio is required";
        if (value.length < 50) return "Bio should be at least 50 characters";
        if (value.length > 500) return "Bio must be less than 500 characters";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    

    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPEG, PNG, WebP)");
        return;
      }


      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, logo: file }));
      toast.success("Logo uploaded successfully!");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData;
      const value = formData[fieldName];
      const error = validateField(fieldName, typeof value === 'string' ? value : '');
      
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
 
      const mockRecruiterProfile = new RecruiterProfile({
        fullName: "",
        email: "",
        companyName: formData.companyName.trim(),
        companyWebsite: formData.companyWebsite?.trim() || undefined,
        companySize: formData.companySize ? parseInt(formData.companySize.split("-")[0]) : undefined,
        industry: formData.industry.trim(),
        designation: formData.designation.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        subscriptionStatus: selectedPlan,
        verificationStatus: "pending",
       
      });

      console.log("Submitting recruiter profile:", {
        profile: mockRecruiterProfile,
        companyName: formData.companyName.trim(),
        companyWebsite: formData.companyWebsite?.trim() || undefined,
        companySize: formData.companySize ? parseInt(formData.companySize.split("-")[0]) : undefined,
        industry: formData.industry.trim(),
        designation: formData.designation.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        subscriptionStatus: selectedPlan,
      });


      await completeProfileUC.execute({
        profile: mockRecruiterProfile,
        companyName: formData.companyName.trim(),
        companyWebsite: formData.companyWebsite?.trim() || undefined,
        companySize: formData.companySize ? parseInt(formData.companySize.split("-")[0]) : undefined,
        industry: formData.industry.trim(),
        designation: formData.designation.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        subscriptionStatus: selectedPlan,
      });
      
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span>Profile created successfully! Welcome to the platform!</span>
        </div>,
        { duration: 4000 }
      );
      
      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 1500);
      
    } catch (error: any) {
      console.error("Error saving profile:", error);
      
      let errorMessage = "Failed to save profile. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const plans = [
    {
      id: "free" as const,
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for individual recruiters starting out",
      features: [
        { text: "1 Active Job Posting", icon: Briefcase },
        { text: "Basic Candidate Search", icon: Users },
        { text: "Email Support", icon: Zap },
        { text: "Access to Talent Pool", icon: Target },
      ],
      button: "Get Started Free",
      subscriptionStatus: "free" as const,
      highlighted: false,
    },
    {
      id: "active" as const,
      name: "Professional",
      price: "$59",
      period: "/month",
      description: "Best for growing recruitment teams",
      features: [
        { text: "Unlimited Job Posts", icon: Briefcase },
        { text: "Advanced Candidate Filters", icon: Users },
        { text: "AI Candidate Matching", icon: Sparkles },
        { text: "Priority Support", icon: Zap },
        { text: "14-Day Free Trial", icon: Check },
      ],
      button: "Start Free Trial",
      subscriptionStatus: "active" as const,
      highlighted: true,
    },
    {
      id: "active" as const,
      name: "Enterprise",
      price: "$149",
      period: "/month",
      description: "Complete recruitment solution for enterprises",
      features: [
        { text: "All Professional Features", icon: Check },
        { text: "Dedicated Account Manager", icon: Users },
        { text: "Custom Workflows", icon: Sparkles },
        { text: "API Access", icon: Zap },
        { text: "SLA Support", icon: Shield },
      ],
      button: "Contact Sales",
      subscriptionStatus: "active" as const,
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-8">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-200 to-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Profile Completion</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">
              Complete Your Recruiter Profile
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tell us about your company and choose a plan to start finding the best talent for your team.
            </p>
          </div>

          {/* Company form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Acme Corporation"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.companyName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    required
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-600 animate-pulse">{errors.companyName}</p>
                  )}
                </div>

                {/* Company Website */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://www.acmecorp.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.companyWebsite 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                  />
                  {errors.companyWebsite && (
                    <p className="text-sm text-red-600 animate-pulse">{errors.companyWebsite}</p>
                  )}
                </div>

                {/* Company Size */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
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
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                {/* Industry */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.industry 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Education">Education</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && (
                    <p className="text-sm text-red-600 animate-pulse">{errors.industry}</p>
                  )}
                </div>

                {/* Designation */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Your Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., HR Manager, Talent Acquisition Lead"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.designation 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    required
                  />
                  {errors.designation && (
                    <p className="text-sm text-red-600 animate-pulse">{errors.designation}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA or Remote"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.location 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 animate-pulse">{errors.location}</p>
                  )}
                </div>
              </div>

              {/* Bio field - Full width */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  About Your Company *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your company culture, mission, values, and what makes you unique. Also mention what kind of talent you're looking for..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.bio 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  required
                />
                <div className="flex justify-between items-center">
                  {errors.bio && (
                    <p className="text-sm text-red-600 animate-pulse">{errors.bio}</p>
                  )}
                  <span className={`text-sm ml-auto ${
                    formData.bio.length > 500 ? 'text-red-500' : 'text-slate-500'
                  }`}>
                    {formData.bio.length}/500 characters
                  </span>
                </div>
              </div>

              {/* Logo upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  Company Logo (Optional)
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  logoPreview 
                    ? 'border-green-400 bg-green-50/50' 
                    : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50/50'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-4">
                    {logoPreview ? (
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Upload className="w-10 h-10 text-blue-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-600">
                        <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG, WebP up to 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Pricing Plans Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Choose Your Plan
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Select the plan that best fits your recruitment needs. All plans include access to our talent network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <div
                  key={plan.id + idx}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedPlan === plan.id
                      ? "bg-white border-2 border-blue-500 shadow-2xl ring-4 ring-blue-500/20"
                      : plan.highlighted
                      ? "bg-linear-to-br from-blue-50 to-white border-2 border-blue-200"
                      : "bg-white border border-slate-200"
                  }`}
                  style={{
                    animationDelay: `${idx * 100}ms`,
                  }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-linear-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 text-sm mt-2">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-slate-900">
                          {plan.price}
                        </span>
                        <span className="text-lg text-slate-600 font-normal ml-2">
                          {plan.period}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Status: {plan.subscriptionStatus.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      {plan.features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm text-slate-700">
                              {feature.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.id);
                      }}
                      className={`w-full py-3.5 rounded-lg font-semibold transition-all duration-300 mt-6 ${
                        selectedPlan === plan.id
                          ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : plan.highlighted
                          ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {selectedPlan === plan.id ? "✓ Selected" : plan.button}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Comparison Note */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    You can upgrade or downgrade your plan at any time
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    All plans include access to our platform and basic features
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              type="button"
              onClick={() => {
                if (Object.keys(formData).some(key => formData[key as keyof FormData])) {
                  if (confirm("You have unsaved changes. Are you sure you want to go back?")) {
                    navigate(-1);
                  }
                } else {
                  navigate(-1);
                }
              }}
              className="flex-1 py-4 px-6 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              ← Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || progress < 100}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                isSubmitting || progress < 100
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl hover:shadow-blue-500/25"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Your Account...
                </>
              ) : progress < 100 ? (
                `Complete Profile (${Math.round(progress)}%)`
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Complete Setup & Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDetails;