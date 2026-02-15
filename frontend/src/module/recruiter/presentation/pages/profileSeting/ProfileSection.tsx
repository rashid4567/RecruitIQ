import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Award,
  ExternalLink,
  Check,
  AlertTriangle,
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
import { profileSchema,type ProfileFormData} from "../forms/recruiterProfile.schema";
import {COMPANY_SIZES , INDUSTRIES } from "../constants/recruiter.constants"



export function RecruiterProfileSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Email update states
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
  formState: { errors, isDirty, touchedFields },
  watch,
  setValue,
  trigger,
} = useForm<ProfileFormData>({
  resolver: zodResolver(profileSchema),
  mode: "onChange",
  defaultValues: {
    fullName: "",
    companyName: "",
    companyWebsite: "",
    companySize: 0,
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
      if (timer) clearTimeout(timer);
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
        companySize: data.companySize ?? 0,
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload JPEG, PNG, WEBP, or GIF images only.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
    };
    reader.readAsDataURL(file);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(0);
    }, 1000);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;

    try {
      setIsSubmitting(true);

      const updatedProfile = profile.updateProfile({
        fullName: data.fullName.trim(),
        companyName: data.companyName.trim(),
        companyWebsite: data.companyWebsite?.trim() || undefined,
        companySize: data.companySize,
        industry: data.industry,
        location: data.location?.trim(),
        bio: data.bio.trim(),
        designation: data.designation.trim(),
        linkedinUrl: data.linkedinUrl?.trim() || undefined,
      });

      const updated = await updateRecruiterUc.execute(updatedProfile);

      setProfile(updated);

      reset({
        fullName: updated.fullName ?? "",
        companyName: updated.companyName ?? "",
        companyWebsite: updated.companyWebsite ?? "",
        companySize: updated.companySize ?? 0,
        industry: updated.industry ?? "",
        location: updated.location ?? "",
        bio: updated.bio ?? "",
        designation: updated.designation ?? "",
        linkedinUrl: updated.linkedinUrl ?? "",
      });

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved.",
      });
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
        companySize: profile.companySize || 0,
        industry: profile.industry || "",
        location: profile.location || "",
        bio: profile.bio || "",
        designation: profile.designation || "",
        linkedinUrl: profile.linkedinUrl || "",
      });
    }
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const getInitials = (name: string) => {
    if (!name?.trim()) return "R";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleEmailUpdateClick = () => {
    setNewEmail("");
    setOtp("");
    setOtpSent(false);
    setEmailError("");
    setIsEmailModalOpen(true);
  };

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
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
        error.message || "Failed to send verification code. Please try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setEmailError("Please enter a valid 6-digit verification code");
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
        error.message || "Invalid verification code. Please try again."
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
        error.message || "Failed to resend code. Please try again."
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

  const currentName = watch("fullName");
  const currentBio = watch("bio");
  const bioLength = currentBio?.length || 0;
  const wordCount = currentBio?.trim() ? currentBio.trim().split(/\s+/).filter(w => w.length > 0).length : 0;

  if (isLoading) {
    return (
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
              <div className="absolute inset-0 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 mx-auto"></div>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-6 max-w-md">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">No Profile Found</h3>
              <p className="text-sm text-slate-600">Unable to load your profile information.</p>
            </div>
            <Button onClick={fetchProfile} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="pb-4 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 text-2xl">Recruiter Profile</CardTitle>
                  <CardDescription>Manage your professional profile and company information</CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1.5 border font-medium ${getStatusColor(profile.subscriptionStatus)}`}
                    >
                      {profile.subscriptionStatus === "active" && (
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      {formatSubscriptionStatus(profile.subscriptionStatus)} Plan
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Your current subscription plan</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1.5 border font-medium ${getStatusColor(profile.verificationStatus)}`}
                    >
                      <Shield className="h-3.5 w-3.5 mr-1.5" />
                      {profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Account verification status</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Avatar & Account Info */}
              <div className="lg:w-1/3 space-y-6">
                <div className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/50">
                  <div className="relative mx-auto w-48 h-48 group">
                    <Avatar className="h-full w-full border-4 border-white shadow-xl transition-transform group-hover:scale-105 duration-300">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="Profile" className="object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <AvatarFallback className="bg-transparent text-white text-4xl font-bold">
                            {getInitials(currentName)}
                          </AvatarFallback>
                        </div>
                      )}
                    </Avatar>

                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2 flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <label htmlFor="avatar-upload" className="cursor-pointer">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-105">
                                <Upload className="h-5 w-5 text-white" />
                              </div>
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={handleAvatarChange}
                                disabled={!isEditing}
                              />
                            </label>
                          </TooltipTrigger>
                          <TooltipContent>Upload new photo</TooltipContent>
                        </Tooltip>

                        {avatarPreview && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={removeAvatar}
                                className="h-12 w-12 rounded-full bg-red-500 shadow-lg shadow-red-500/25 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-105"
                              >
                                <X className="h-5 w-5 text-white" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Remove photo</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center mt-2 text-slate-600">Uploading... {uploadProgress}%</p>
                    </div>
                  )}

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg">Profile Photo</h4>
                      <p className="text-sm text-slate-600 mt-1">Upload a professional headshot.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="px-2 py-1 bg-slate-100 rounded-md">400×400px</span>
                      <span className="px-2 py-1 bg-slate-100 rounded-md">JPG/PNG</span>
                      <span className="px-2 py-1 bg-slate-100 rounded-md">Max 5MB</span>
                    </div>
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
                              <p className="font-medium text-slate-900 text-sm">Email Address</p>
                              <p className="text-xs text-slate-500 truncate max-w-[180px]" title={profile.email}>
                                {profile.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs border-blue-200">Update</Badge>
                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-xs text-slate-500">Used</span>
                          </div>
                          <p className="text-lg font-semibold text-slate-900">{profile.jobPostsUsed ?? 0}</p>
                          <p className="text-xs text-slate-500">Job posts</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-xs text-slate-500">Plan</span>
                          </div>
                          <p className="text-lg font-semibold text-slate-900 capitalize">
                            {formatSubscriptionStatus(profile.subscriptionStatus)}
                          </p>
                          <p className="text-xs text-slate-500">Subscription</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form Fields */}
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
                      <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>Full Name <span className="text-red-500">*</span></span>
                        {errors.fullName && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.fullName.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="fullName"
                          {...register("fullName", { onChange: () => trigger("fullName") })}
                          disabled={!isEditing}
                          className={`h-12 pl-11 transition-all ${
                            errors.fullName 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
                          placeholder="John Doe"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        {touchedFields.fullName && !errors.fullName && isEditing && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>Designation <span className="text-red-500">*</span></span>
                        {errors.designation && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.designation.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="designation"
                          {...register("designation", { onChange: () => trigger("designation") })}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${
                            errors.designation 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
                          placeholder="Senior Technical Recruiter"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>Location</span>
                        {errors.location && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.location.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="location"
                          {...register("location")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${
                            errors.location 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
                          placeholder="San Francisco, CA"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                    </div>

                    {/* LinkedIn URL */}
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>LinkedIn Profile</span>
                        {errors.linkedinUrl && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.linkedinUrl.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="linkedinUrl"
                          {...register("linkedinUrl")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${
                            errors.linkedinUrl 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
                          placeholder="https://linkedin.com/in/username"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                        </div>
                        {profile?.linkedinUrl && !isEditing && (
                          <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
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
                      <Label htmlFor="companyName" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>Company Name <span className="text-red-500">*</span></span>
                        {errors.companyName && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.companyName.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="companyName"
                          {...register("companyName", { onChange: () => trigger("companyName") })}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${
                            errors.companyName 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
                          placeholder="Acme Inc."
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Building className="h-4 w-4 text-indigo-600" />
                        </div>
                      </div>
                    </div>

                    {/* Company Size */}
                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>Company Size <span className="text-red-500">*</span></span>
                        {errors.companySize && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.companySize.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Select
                          disabled={!isEditing}
                          value={watch("companySize")?.toString()}
                          onValueChange={(value) => {
                            setValue("companySize", parseInt(value, 10), { shouldValidate: true });
                            trigger("companySize");
                          }}
                        >
                          <SelectTrigger className={`h-12 pl-11 ${
                            errors.companySize 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPANY_SIZES.map(({ value, label, range }) => (
                              <SelectItem key={value} value={value.toString()}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{label}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">{range}</Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center pointer-events-none">
                          <Users className="h-4 w-4 text-rose-600" />
                        </div>
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>Industry <span className="text-red-500">*</span></span>
                        {errors.industry && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.industry.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Select
                          disabled={!isEditing}
                          value={watch("industry")}
                          onValueChange={(value) => {
                            setValue("industry", value, { shouldValidate: true });
                            trigger("industry");
                          }}
                        >
                          <SelectTrigger className={`h-12 pl-11 ${
                            errors.industry 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center pointer-events-none">
                          <Award className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    {/* Company Website */}
                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                        <span>Company Website</span>
                        {errors.companyWebsite && (
                          <span className="text-red-500 text-xs font-normal flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.companyWebsite.message}
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="companyWebsite"
                          {...register("companyWebsite")}
                          disabled={!isEditing}
                          className={`h-12 pl-11 ${
                            errors.companyWebsite 
                              ? "border-red-300 focus:ring-red-500/20" 
                              : "border-slate-200"
                          } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
                          placeholder="https://company.com"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-sky-600" />
                        </div>
                        {profile?.companyWebsite && !isEditing && (
                          <a
                            href={profile.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
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
                    <Label htmlFor="bio" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                      <span>About You & Your Company <span className="text-red-500">*</span></span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          bioLength > 450 
                            ? "bg-red-100 text-red-700" 
                            : bioLength > 400
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {bioLength}/500
                        </span>
                        <span className="text-xs text-slate-500">{wordCount} words</span>
                      </div>
                    </Label>
                    
                    <Textarea
                      id="bio"
                      {...register("bio", { onChange: () => trigger("bio") })}
                      disabled={!isEditing}
                      rows={5}
                      className={`min-h-[140px] resize-y ${
                        errors.bio 
                          ? "border-red-300 focus:ring-red-500/20" 
                          : "border-slate-200"
                      } ${!isEditing ? "bg-slate-50" : "bg-white"}`}
                      placeholder="Tell us about your professional background, expertise, and what makes you unique as a recruiter..."
                    />
                    
                    {errors.bio && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.bio.message}
                      </p>
                    )}
                    
                    {bioLength < 10 && isEditing && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Minimum 10 characters required
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              {isEditing ? (
                <>
                  <div className={`h-2 w-2 rounded-full ${isDirty ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-slate-600">
                    {isDirty 
                      ? "You have unsaved changes. Save or cancel to continue."
                      : "No changes made yet."}
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-slate-600">Ready to update your profile information?</span>
                </>
              )}
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
                    disabled={isSubmitting || !isDirty || Object.keys(errors).length > 0}
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
                  <Label htmlFor="modal-email" className="text-sm font-semibold text-gray-700">
                    New Email Address <span className="text-red-500">*</span>
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
                      <p className="text-sm font-medium text-red-700">{emailError}</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                      <Info className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-semibold text-gray-800">What happens next?</p>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>You'll receive a 6-digit verification code</span>
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
                      Verification Code <span className="text-red-500">*</span>
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
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
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
                          <span className="text-2xl font-bold text-gray-800">{otp[index] || ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {emailError && (
                    <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-red-700">{emailError}</p>
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
                        <p className="text-sm font-semibold text-gray-800">Can't find the code?</p>
                        <p className="text-sm text-gray-600">
                          Check your spam folder or wait a few moments. Codes are valid for 15 minutes.
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
                className="gap-2 px-6 h-11 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50"
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
                className="gap-2 px-6 h-11 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50"
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
    </TooltipProvider>
  );
}