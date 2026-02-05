import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Linkedin,
  Upload,
  Edit,
  Loader2,
  Globe,
  Briefcase,
  Building,
  MapPin,
  Save,
  X,
  Users,
  FileText,
  CheckCircle,
  Mail,
  Calendar,
  AlertCircle,
  Clock,
  RefreshCw,
  Send,
  Shield,
  Info,
  HelpCircle,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";
import {
  updateRecruiterUc,
  GetRecruiterProfileUc,
} from "../../di/recruiter.di";
import {
  requestEmailUpdateUc,
  verifyEmailUpdateUc,
} from "@/module/auth/presentation/di/auth";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  companyName: z.string().min(2, "Company name is required").max(100),
  companyWebsite: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  companySize: z.string().min(1, "Company size is required"),
  industry: z.string().min(2, "Industry is required"),
  location: z.string().optional(),
  bio: z
    .string()
    .min(10, "Bio should be at least 10 characters")
    .max(500, "Bio should not exceed 500 characters"),
  designation: z.string().min(2, "Designation is required").max(100),
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const COMPANY_SIZES = [
  { value: "1", label: "1-10 employees" },
  { value: "11", label: "11-50 employees" },
  { value: "51", label: "51-200 employees" },
  { value: "201", label: "201-500 employees" },
  { value: "501", label: "501-1000 employees" },
  { value: "1001", label: "1000+ employees" },
];

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Marketing",
  "Real Estate",
  "Hospitality",
  "Other",
];

export function RecruiterProfileSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailError, setEmailError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      location: "",
      bio: "",
      designation: "",
      linkedinUrl: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    if (countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await GetRecruiterProfileUc.execute();
      setProfile(data);

      reset({
        fullName: data.fullName ?? "",
        companyName: data.companyName ?? "",
        companyWebsite: data.companyWebsite ?? "",
        companySize: data.companySize?.toString() ?? "",
        industry: data.industry ?? "",
        location: data.location ?? "",
        bio: data.bio ?? "",
        designation: data.designation ?? "",
        linkedinUrl: data.linkedinUrl ?? "",
      });
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPEG, PNG, etc.).",
      });
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;

    try {
      setIsSubmitting(true);

      const companySize = data.companySize
        ? parseInt(data.companySize)
        : undefined;

      const updatedProfile = profile.updateProfile({
        fullName: data.fullName,
        companyName: data.companyName,
        companyWebsite: data.companyWebsite || undefined,
        companySize,
        industry: data.industry,
        location: data.location,
        bio: data.bio,
        designation: data.designation,
        linkedinUrl: data.linkedinUrl || undefined,
      });

      const updated = await updateRecruiterUc.execute(updatedProfile);

      setProfile(updated);

      reset({
        fullName: updated.fullName ?? "",
        companyName: updated.companyName ?? "",
        companyWebsite: updated.companyWebsite ?? "",
        companySize: updated.companySize?.toString() ?? "",
        industry: updated.industry ?? "",
        location: updated.location ?? "",
        bio: updated.bio ?? "",
        designation: updated.designation ?? "",
        linkedinUrl: updated.linkedinUrl ?? "",
      });

      setIsEditing(false);
      setAvatarFile(null);

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved.",
      });

      setIsEditing(false);
      setAvatarFile(null);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error("Update failed", {
        description: error.message || "Please check your input and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        fullName: profile.fullName || "",
        companyName: profile.companyName || "",
        companyWebsite: profile.companyWebsite || "",
        companySize: profile.companySize?.toString() || "",
        industry: profile.industry || "",
        location: profile.location || "",
        bio: profile.bio || "",
        designation: profile.designation || "",
        linkedinUrl: profile.linkedinUrl || "",
      });
    }

    setIsEditing(false);
    setAvatarFile(null);
  };

  const getInitials = (name: string) => {
    if (!name.trim()) return "R";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "expired":
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "free":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatSubscriptionStatus = (status?: string) => {
    if (!status) return "Free";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleEmailUpdateClick = () => {
    setNewEmail("");
    setOtp("");
    setOtpSent(false);
    setEmailError("");
    setIsEmailModalOpen(true);
  };

  const handleSendOtp = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      setIsSendingOtp(true);
      setEmailError("");
      await requestEmailUpdateUc.execute({ email: newEmail });
      setOtpSent(true);
      setCountdown(60);
      toast.success("Verification code sent", {
        description: "Check your email for the 6-digit code",
      });
    } catch (error: any) {
      console.error("Send OTP error:", error);
      setEmailError(
        error.message || "Failed to send verification code. Please try again.",
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setEmailError("Please enter the 6-digit verification code");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setEmailError("");

      await verifyEmailUpdateUc.execute({
        email: newEmail,
        otp,
      });

      await fetchProfile();

      toast.success("Email updated successfully", {
        description: "Your email address has been verified and updated.",
      });

      setIsEmailModalOpen(false);
      setOtpSent(false);
      setNewEmail("");
      setOtp("");
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      setEmailError(
        error.message || "Invalid verification code. Please try again.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    try {
      setIsSendingOtp(true);
      setEmailError("");
      await requestEmailUpdateUc.execute({ email: newEmail });
      setCountdown(60);
      toast.success("New code sent", {
        description: "A new verification code has been sent to your email",
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setEmailError(
        error.message || "Failed to resend code. Please try again.",
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleModalClose = () => {
    if (isSendingOtp || isVerifyingOtp) return;

    setIsEmailModalOpen(false);
    setNewEmail("");
    setOtp("");
    setOtpSent(false);
    setEmailError("");
    setCountdown(0);
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
            <p className="text-sm text-slate-600">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <User className="h-12 w-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-900">
              No Profile Found
            </h3>
            <p className="text-sm text-slate-600">
              Unable to load your profile information.
            </p>
            <Button onClick={fetchProfile} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentName = watch("fullName");
  const currentBio = watch("bio");
  const bioLength = currentBio?.length || 0;

  return (
    <>
      <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 text-2xl">
                    Recruiter Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your professional profile and company information
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`px-3 py-1 border font-medium ${getStatusColor(profile.subscriptionStatus)}`}
                >
                  {profile.subscriptionStatus === "active" && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {formatSubscriptionStatus(profile.subscriptionStatus)} Plan
                </Badge>

                <Badge
                  variant="outline"
                  className={`px-3 py-1 border font-medium ${getStatusColor(profile.verificationStatus)}`}
                >
                  {(profile.verificationStatus ?? "pending").replace(
                    /^\w/,
                    (c) => c.toUpperCase(),
                  )}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 space-y-6">
                <div className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/50">
                  <div className="relative mx-auto w-48 h-48">
                    <Avatar className="h-full w-full border-4 border-white shadow-xl">
                      {avatarPreview ? (
                        <AvatarImage
                          src={avatarPreview}
                          alt="Profile"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <AvatarFallback className="bg-transparent text-white text-4xl font-bold">
                            {getInitials(currentName)}
                          </AvatarFallback>
                        </div>
                      )}
                    </Avatar>

                    {isEditing && (
                      <label
                        htmlFor="avatar-upload"
                        className="absolute -bottom-2 -right-2 cursor-pointer"
                      >
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-105">
                          <Upload className="h-5 w-5 text-white" />
                        </div>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                          disabled={!isEditing}
                        />
                      </label>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg">
                        Profile Photo
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Upload a professional headshot. Recommended: 400×400px,
                        JPG or PNG, max 5MB.
                      </p>
                    </div>

                    {isEditing && (
                      <div className="flex flex-wrap gap-3">
                        <label htmlFor="avatar-upload">
                          <Button
                            type="button"
                            variant="outline"
                            className="gap-2 border-slate-200 hover:border-slate-300"
                          >
                            <Upload className="h-4 w-4" />
                            Upload New
                          </Button>
                        </label>

                        {avatarPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={removeAvatar}
                            className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                          >
                            Remove Photo
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Info Card */}
                <Card className="border-slate-200/50 shadow-sm">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-500" />
                      Account Information
                    </h4>
                    <div className="space-y-4">
                      {/* Email Card */}
                      <div
                        onClick={handleEmailUpdateClick}
                        className="group cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                Email Address
                              </p>
                              <p
                                className="text-xs text-slate-500 truncate max-w-[180px]"
                                title={profile.email}
                              >
                                {profile.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Job Posts Used */}
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">
                            Job Posts Used
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900">
                              {profile.jobPostsUsed ?? 0}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Status */}
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Subscription</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900">
                              {formatSubscriptionStatus(
                                profile.subscriptionStatus,
                              )}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(profile.subscriptionStatus)}`}
                            >
                              {profile.subscriptionStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:w-2/3 space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        Full Name
                        {errors.fullName && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.fullName.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="fullName"
                          {...register("fullName")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${errors.fullName ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : ""}`}
                          placeholder="Enter the name"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                      </div>
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="designation"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        Designation
                        {errors.designation && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.designation.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="designation"
                          {...register("designation")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${errors.designation ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : ""}`}
                          placeholder="Enter the designation"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        Location
                        {errors.location && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.location.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="location"
                          {...register("location")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${errors.location ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : ""}`}
                          placeholder="Enter the location"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                    </div>

                    {/* LinkedIn URL */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="linkedinUrl"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        LinkedIn Profile
                        {errors.linkedinUrl && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.linkedinUrl.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="linkedinUrl"
                          {...register("linkedinUrl")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${errors.linkedinUrl ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : ""}`}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Building className="h-5 w-5 text-indigo-500" />
                    Company Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        Company Name
                        {errors.companyName && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.companyName.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="companyName"
                          {...register("companyName")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${errors.companyName ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : ""}`}
                          placeholder="Enter the company name"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Building className="h-4 w-4 text-indigo-600" />
                        </div>
                      </div>
                    </div>

                    {/* Company Size */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="companySize"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        Company Size
                        {errors.companySize && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.companySize.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <select
                          id="companySize"
                          {...register("companySize")}
                          disabled={!isEditing}
                          className={`w-full h-12 pl-11 pr-4 rounded-md border ${errors.companySize ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer`}
                        >
                          <option value="">Select company size</option>
                          {COMPANY_SIZES.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
                          <Users className="h-4 w-4 text-rose-600" />
                        </div>
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="industry"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        Industry
                        {errors.industry && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.industry.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <select
                          id="industry"
                          {...register("industry")}
                          disabled={!isEditing}
                          className={`w-full h-12 pl-11 pr-4 rounded-md border ${errors.industry ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer`}
                        >
                          <option value="">Select industry</option>
                          {INDUSTRIES.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Building className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    {/* Company Website */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="companyWebsite"
                        className="text-sm font-medium text-slate-700 flex items-center justify-between"
                      >
                        Company Website
                        {errors.companyWebsite && (
                          <span className="text-red-500 text-xs font-normal">
                            {errors.companyWebsite.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="companyWebsite"
                          {...register("companyWebsite")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${errors.companyWebsite ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : ""}`}
                          placeholder="https://company.com"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-sky-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-500" />
                    Professional Bio
                  </h3>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-slate-700 flex items-center justify-between"
                    >
                      About You & Your Company
                      <span
                        className={`text-xs ${bioLength > 450 ? "text-red-500" : "text-slate-500"}`}
                      >
                        {bioLength}/500 characters
                      </span>
                    </Label>
                    <Textarea
                      id="bio"
                      {...register("bio")}
                      disabled={!isEditing}
                      rows={4}
                      className={`min-h-[120px] resize-y ${errors.bio ? "border-red-300 focus:ring-red-500/20" : "border-slate-200"} ${!isEditing ? "bg-slate-50" : ""}`}
                      placeholder="Tell us about your professional background, expertise, and what makes you unique as a recruiter..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      Share your experience, skills, and what you're looking for
                      in candidates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-500 text-center sm:text-left">
              {isEditing
                ? isDirty
                  ? "You have unsaved changes. Save or cancel to continue."
                  : "Make changes to your profile and save them."
                : "Ready to update your profile information?"}
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-11 px-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 px-6 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                    disabled={isSubmitting || !isDirty}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsEditing(true)}
                  className="h-11 px-6 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Email Update Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-6 pt-8 pb-6">
            <div className="absolute inset-0 bg-grid-white/5"></div>
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    {otpSent ? "Verify Your Email" : "Secure Email Update"}
                  </DialogTitle>
                  <DialogDescription className="text-indigo-100/90 text-sm">
                    {otpSent
                      ? "Enter the 6-digit verification code sent to your email"
                      : "Enter your new email address to receive a verification code"}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {!otpSent ? (
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label
                    htmlFor="modal-email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    New Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <Input
                      id="modal-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        setEmailError("");
                      }}
                      disabled={isSendingOtp}
                      className={`pl-12 h-12 text-base rounded-xl border-2 transition-all duration-200 ${
                        emailError
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      }`}
                      autoFocus
                    />
                  </div>
                  {emailError && (
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-red-700">
                        {emailError}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                      <Info className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        What happens next?
                      </p>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>
                            You'll receive a 6-digit verification code
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>The code expires in 15 minutes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>Your email won't change until verified</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-gray-700">
                      Verification Code
                    </Label>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                      <Mail className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700 truncate max-w-[140px]">
                        {newEmail}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      id="otp-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setOtp(value);
                        setEmailError("");
                      }}
                      onFocus={(e) => e.target.select()}
                      disabled={isVerifyingOtp}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-default"
                      autoFocus
                      maxLength={6}
                    />

                    <div className="flex justify-center gap-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            document.getElementById("otp-input")?.focus();
                          }}
                          className={`h-14 w-12 rounded-xl border-2 flex items-center justify-center cursor-text transition-all duration-200 ${
                            otp[index]
                              ? "bg-gradient-to-b from-indigo-50 to-white border-indigo-500 shadow-sm shadow-indigo-500/20"
                              : index === otp.length
                                ? "border-indigo-400 ring-4 ring-indigo-100"
                                : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-2xl font-bold text-gray-800">
                            {otp[index] || ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {emailError && (
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-red-700">
                        {emailError}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || isSendingOtp}
                      className="flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all hover:gap-3"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending new code...
                        </>
                      ) : countdown > 0 ? (
                        <>
                          <Clock className="h-4 w-4" />
                          Resend in {countdown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Resend verification code
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setEmailError("");
                      }}
                      className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-800 transition-all hover:gap-3"
                    >
                      <Edit className="h-4 w-4" />
                      Change email
                    </button>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                        <HelpCircle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          Can't find the code?
                        </p>
                        <p className="text-sm text-gray-600">
                          Check your spam folder or wait a few moments. Codes
                          are valid for 15 minutes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleModalClose}
              disabled={isSendingOtp || isVerifyingOtp}
              className="px-6 h-11 rounded-xl font-semibold border-2 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            {!otpSent ? (
              <Button
                onClick={handleSendOtp}
                disabled={isSendingOtp || !newEmail}
                className="gap-2 px-6 h-11 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otp.length !== 6}
                className="gap-2 px-6 h-11 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Verify & Update Email
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
