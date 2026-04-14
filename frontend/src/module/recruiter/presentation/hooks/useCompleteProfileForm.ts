
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { completeProfileUC } from "../di/recruiter.di";

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

export function useCompleteProfile() {
  const navigate = useNavigate();

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

  useEffect(() => {
    const requiredFields: (keyof FormData)[] = ["companyName", "industry", "designation", "bio"];
    const filledCount = requiredFields.filter((field) => {
      const value = formData[field];
      return typeof value === "string" && value.trim().length > 0;
    }).length;
    setProgress((filledCount / requiredFields.length) * 100);
  }, [formData]);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "companyName":
        if (!value.trim()) return "Company name is required";
        if (value.length < 2) return "Company name must be at least 2 characters";
        if (value.length > 100) return "Company name must be less than 100 characters";
        return "";
      case "companyWebsite":
        if (value && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value))
          return "Please enter a valid website URL";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("File size must be less than 2MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setFormData((prev) => ({ ...prev, logo: file }));
    toast.success("Logo uploaded successfully");
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const value = formData[key];
      const error = validateField(key, typeof value === "string" ? value : "");
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
    
      const rawSize = formData.companySize
        ? parseInt(formData.companySize.split("-")[0], 10)
        : NaN;
      const companySize = Number.isFinite(rawSize) ? rawSize : undefined;

      await completeProfileUC.execute({
        companyName: formData.companyName.trim(),
        companyWebsite: formData.companyWebsite?.trim() || undefined,
        companySize,
        industry: formData.industry.trim() || undefined,
        designation: formData.designation.trim() || undefined,
        location: formData.location.trim() || undefined,
        bio: formData.bio.trim() || undefined,
      });

      toast.success("Profile created successfully! Welcome aboard!");
      setTimeout(() => navigate("/recruiter"), 1500);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to save profile";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    selectedPlan,
    isSubmitting,
    logoPreview,
    progress,
    setSelectedPlan,
    handleInputChange,
    handleLogoUpload,
    handleSubmit,
  };
}