"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  FileBadge
} from "lucide-react"
import { recruiterService } from "../../../services/recruiter/recruiter.service"
import type { RecruiterProfileResponse } from "../../../types/recruiter/recruiter.profile.type"

// Validation schema based on API structure
const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  profileImage: z.string().optional(),
  companyName: z.string().min(2, "Company name is required").max(100),
  companyWebsite: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  companySize: z.string().min(1, "Company size is required"),
  industry: z.string().min(2, "Industry is required"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(10, "Bio should be at least 10 characters").max(500, "Bio should not exceed 500 characters"),
  designation: z.string().min(2, "Designation is required").max(100),
})

type ProfileFormData = z.infer<typeof profileSchema>

// Company size options
const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" }
]

// Industry options
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
  "Other"
]

export function ProfileSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [profileData, setProfileData] = useState<RecruiterProfileResponse | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
    setValue,
    control
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      profileImage: "",
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      location: "",
      bio: "",
      designation: "",
    }
  })

 
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const data = await recruiterService.getProfile()
      setProfileData(data)
      
     
      // const storedEmail = localStorage.getItem("userEmail") || data.email || ""
      // setUserEmail(storedEmail)
      
    
      reset({
        fullName: data.fullName || "",
        profileImage: data.profileImage || "",
        companyName: data.companyName || "",
        companyWebsite: data.companyWebsite || "",
        companySize: data.companySize || "",
        industry: data.industry || "",
        location: data.location || "",
        bio: data.bio || "",
        designation: data.designation || "",
      })
      
      if (data.profileImage) {
        setAvatarPreview(data.profileImage)
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
      toast.error("Failed to load profile", {
        description: "Please try again later."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB."
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPEG, PNG, etc.)."
      })
      return
    }

    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setAvatarPreview(base64String)
      setValue("profileImage", base64String, { shouldDirty: true })
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setValue("profileImage", "", { shouldDirty: true })
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)

      // Create payload matching API structure
      const payload = {
        fullName: data.fullName,
        profileImage: data.profileImage || undefined,
        companyName: data.companyName,
        companyWebsite: data.companyWebsite || undefined,
        companySize: data.companySize,
        industry: data.industry,
        location: data.location,
        bio: data.bio,
        designation: data.designation,
      }

      await recruiterService.updateProfile(payload)
      
      // Update profile data
      const updatedData = await recruiterService.getProfile()
      setProfileData(updatedData)
      
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved."
      })

      setIsEditing(false)
      setAvatarFile(null)
      
    } catch (error: any) {
      console.error("Update error:", error)
      toast.error("Update failed", {
        description: error.response?.data?.message || "Please check your input and try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    fetchProfile() // Reset to original data
    setIsEditing(false)
    setAvatarFile(null)
  }

  const getInitials = (name: string) => {
    if (!name.trim()) return "U"
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
    )
  }

  const currentName = watch("fullName")
  const currentBio = watch("bio")
  const bioLength = currentBio?.length || 0

  return (
    <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-2xl">Recruiter Profile</CardTitle>
                <CardDescription>
                  Manage your professional profile and company information
                </CardDescription>
              </div>
            </div>
            
            {/* Account Status Badges */}
            {profileData && (
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline"
                  className={`px-3 py-1 border font-medium ${
                    profileData.subscriptionStatus === "active" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : profileData.subscriptionStatus === "free"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {profileData.subscriptionStatus === "active" && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {profileData.subscriptionStatus.charAt(0).toUpperCase() + profileData.subscriptionStatus.slice(1)} Plan
                </Badge>
                
                <Badge 
                  variant="outline"
                  className={`px-3 py-1 border font-medium ${
                    profileData.verificationStatus === "verified" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : profileData.verificationStatus === "pending"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {profileData.verificationStatus.charAt(0).toUpperCase() + profileData.verificationStatus.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Avatar & Bio Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar Section */}
            <div className="lg:w-1/3 space-y-6">
              <div className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/50">
                <div className="relative mx-auto w-48 h-48">
                  <Avatar className="h-full w-full border-4 border-white shadow-xl">
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
                    <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 cursor-pointer">
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
                    <h4 className="font-semibold text-slate-900 text-lg">Profile Photo</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Upload a professional headshot. Recommended: 400×400px, JPG or PNG, max 5MB.
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

              {/* Stats & Info Card */}
              <Card className="border-slate-200/50 shadow-sm">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FileBadge className="h-5 w-5 text-blue-500" />
                    Profile Information
                  </h4>
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-900 truncate" title={userEmail}>
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    {/* Job Posts Used */}
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Job Posts Used</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900">
                            {profileData?.jobPostsUsed || 0}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Member Since</p>
                        <p className="text-sm font-medium text-slate-900">
                          {profileData?.createdAt ? formatDate(profileData.createdAt) : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Profile ID */}
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">Profile ID</p>
                        <p className="text-sm font-medium text-slate-900 truncate" title={profileData?._id}>
                          {profileData?._id ? profileData._id.substring(0, 8) + "..." : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Fields */}
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
                        className={`h-12 pl-11 ${errors.fullName ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : ''}`}
                        placeholder="John Doe"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-sm font-medium text-slate-700 flex items-center justify-between">
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
                        className={`h-12 pl-11 ${errors.designation ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : ''}`}
                        placeholder="Senior Recruiter"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-slate-700 flex items-center justify-between">
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
                        className={`h-12 pl-11 ${errors.location ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : ''}`}
                        placeholder="San Francisco, CA"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-amber-600" />
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Profile */}
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-sm font-medium text-slate-700">
                      LinkedIn Profile (Optional)
                    </Label>
                    <div className="relative">
                      <Input
                        id="linkedin"
                        className="h-12 pl-11 border-slate-200 disabled:bg-slate-50"
                        placeholder="https://linkedin.com/in/yourprofile"
                        disabled={!isEditing}
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
                    <Label htmlFor="companyName" className="text-sm font-medium text-slate-700 flex items-center justify-between">
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
                        className={`h-12 pl-11 ${errors.companyName ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : ''}`}
                        placeholder="TechCorp Inc."
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Building className="h-4 w-4 text-indigo-600" />
                      </div>
                    </div>
                  </div>

                  {/* Company Size */}
                  <div className="space-y-2">
                    <Label htmlFor="companySize" className="text-sm font-medium text-slate-700 flex items-center justify-between">
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
                        className={`w-full h-12 pl-11 pr-4 rounded-md border ${errors.companySize ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer`}
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
                    <Label htmlFor="industry" className="text-sm font-medium text-slate-700 flex items-center justify-between">
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
                        className={`w-full h-12 pl-11 pr-4 rounded-md border ${errors.industry ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer`}
                      >
                        <option value="">Select industry</option>
                        {INDUSTRIES.map(industry => (
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
                    <Label htmlFor="companyWebsite" className="text-sm font-medium text-slate-700 flex items-center justify-between">
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
                        className={`h-12 pl-11 ${errors.companyWebsite ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : ''}`}
                        placeholder="https://company.com"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-sky-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  Professional Bio
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-slate-700 flex items-center justify-between">
                    About You
                    <span className={`text-xs ${bioLength > 450 ? 'text-red-500' : 'text-slate-500'}`}>
                      {bioLength}/500 characters
                    </span>
                  </Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    disabled={!isEditing}
                    rows={4}
                    className={`min-h-[120px] resize-y ${errors.bio ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-200'} ${!isEditing ? 'bg-slate-50' : ''}`}
                    placeholder="Tell us about your professional background, expertise, and what makes you unique as a recruiter..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Share your experience, skills, and what you're looking for in candidates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500 text-center sm:text-left">
            {isEditing ? (
              isDirty ? (
                "You have unsaved changes. Save or cancel to continue."
              ) : (
                "Make changes to your profile and save them."
              )
            ) : (
              "Ready to update your profile information?"
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
  )
}