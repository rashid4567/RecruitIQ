"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  Linkedin,
  Globe,
  MapPin,
  CheckCircle,
  Calendar,
  Loader2,
  Save,
  User,
  Briefcase,
  Mail,
  X,
  Edit2,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import type {
  CandidateProfileResponse,
  UpdateCandidateProfileRequest,
} from "@/types/candidate/candidate.profile.type"
import { toast } from "sonner"
import { validateCandidateProfile, validateField, sanitizeCandidateData, type ValidationErrors, isValidUrl } from "@/lib/validation/candidate.validation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PersonalInfoFormProps {
  profile: CandidateProfileResponse;
  isEditing: boolean;
  editData: UpdateCandidateProfileRequest;
  onInputChange: (field: keyof UpdateCandidateProfileRequest, value: any) => void;
  onEditToggle: () => void;
  onSave: (data: UpdateCandidateProfileRequest) => Promise<void>;
  onVerifyEmail: () => void;
  emailVerificationSent: boolean;
  onImageUpload: (file: File) => Promise<void>;
  loading: boolean;
}

export function PersonalInfoForm({ 
  profile, 
  isEditing, 
  editData, 
  onInputChange, 
  onEditToggle,
  onSave,
  onVerifyEmail,
  emailVerificationSent,
  onImageUpload,
  loading 
}: PersonalInfoFormProps) {
  const { user, candidateProfile } = profile
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(user.profileImage || "")
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      setValidationErrors({})
      setTouchedFields(new Set())
    }
  }, [isEditing])

  const getFieldValue = (field: keyof UpdateCandidateProfileRequest) => {
    return editData[field] ?? (field === 'fullName' ? user.fullName : candidateProfile[field as keyof typeof candidateProfile])
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {

      const validationResult = validateField("profileImage", file)
      if (validationResult) {
        toast.error(validationResult)
        return
      }
      
      setSelectedImage(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    
    }
  }

  const handleSaveImage = async () => {
    if (selectedImage) {
      try {
        await onImageUpload(selectedImage)
        setSelectedImage(null)
        toast.success("Profile photo updated successfully")
      } catch (error) {
        toast.error("Failed to upload profile photo")
      }
    }
  }

  const handleFieldChange = (field: keyof UpdateCandidateProfileRequest, value: any) => {

    setTouchedFields(prev => new Set(prev).add(field))
    
    let processedValue = value
    
    if ((field === 'skills' || field === 'preferredJobLocation') && typeof value === 'string') {
      const items = value.split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0)
      processedValue = items
    }

    if (typeof processedValue === 'string') {
      processedValue = processedValue.trim()
    }
    

    if ((field === 'linkedinUrl' || field === 'portfolioUrl') && processedValue && !processedValue.startsWith('http')) {
      processedValue = 'https://' + processedValue
    }
    
    
    const error = validateField(field, processedValue)
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field]: error }))
    } else {
      
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    
 
    onInputChange(field, processedValue)
  }

  const handleBlur = (field: keyof UpdateCandidateProfileRequest) => {
    setTouchedFields(prev => new Set(prev).add(field))
    

    const value = getFieldValue(field)
    const error = validateField(field, value)
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field]: error }))
    } else {
     
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleRemoveItem = (field: 'skills' | 'preferredJobLocation', index: number) => {
    const currentItems = Array.isArray(editData[field]) 
      ? [...(editData[field] as any[])] 
      : Array.isArray(candidateProfile[field as keyof typeof candidateProfile])
        ? [...(candidateProfile[field as keyof typeof candidateProfile] as any[])]
        : []
    
    const newItems = currentItems.filter((_, i) => i !== index)
    handleFieldChange(field, newItems)
  }

  const handleSave = async () => {
    
    const allFields: Array<keyof UpdateCandidateProfileRequest> = [
      'fullName', 'currentJob', 'experienceYears', 'educationLevel', 'gender',
      'currentJobLocation', 'preferredJobLocation', 'skills', 'linkedinUrl',
      'portfolioUrl', 'bio'
    ]
    
    const newTouchedFields = new Set([...touchedFields, ...allFields])
    setTouchedFields(newTouchedFields)
    
    
    const sanitizedData = sanitizeCandidateData(editData)
    const validationResult = validateCandidateProfile(sanitizedData)
    
    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors)
      
      const errorCount = Object.keys(validationResult.errors).length
      toast.error(`Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before saving`, {
        action: {
          label: 'Show Errors',
          onClick: () => {
        
            const firstErrorField = Object.keys(validationResult.errors)[0]
            const element = document.getElementById(firstErrorField)
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
              })
              
       
              setTimeout(() => {
                const input = element.querySelector('input, textarea, select')
                if (input) {
                  (input as HTMLElement).focus()
                }
              }, 300)
            }
          }
        }
      })
      
      return
    }
    
    setIsSaving(true)
    try {

      if (selectedImage) {
        try {
          await onImageUpload(selectedImage)
          setSelectedImage(null)
        } catch (error) {
          toast.error("Failed to upload profile photo")
          setIsSaving(false)
          return
        }
      }
      
      await onSave(sanitizedData)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const hasErrors = Object.keys(validationErrors).length > 0
  const isEmailVerified = user.emailVerified || !user.email.includes("@example.com")

 
  const shouldShowError = (field: string): boolean => {
    return touchedFields.has(field) && !!validationErrors[field]
  }


  const getFieldClasses = (field: string, additionalClasses = ''): string => {
    const baseClasses = "transition-all duration-200 focus:ring-2 focus:ring-offset-1"
    const errorClasses = "border-red-300 focus:border-red-500 focus:ring-red-100"
    const normalClasses = "border-gray-300 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-400"
    
    return cn(
      baseClasses,
      shouldShowError(field) ? errorClasses : normalClasses,
      additionalClasses
    )
  }


  const experienceOptions = [
    { value: "0", label: "0-1 years (Entry Level)" },
    { value: "1", label: "1-2 years" },
    { value: "2", label: "2-3 years" },
    { value: "3", label: "3-5 years" },
    { value: "5", label: "5-7 years" },
    { value: "7", label: "7-10 years" },
    { value: "10", label: "10+ years" },
  ]

const getDisplayValue = (
  field: keyof UpdateCandidateProfileRequest
): string => {
  const value = getFieldValue(field);

  // Handle arrays (skills, locations)
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not specified";
  }

  // Handle empty values
  if (value === undefined || value === null || value === "") {
    return "Not specified";
  }

  switch (field) {
    case "educationLevel":
      return String(value)
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    case "gender":
      return String(value)
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    case "experienceYears": {
      const years = Number(value);
      if (isNaN(years)) return "Not specified";
      return `${years} ${years === 1 ? "year" : "years"}`;
    }

    default:
      return String(value);
  }
};


  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personal Information</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your profile details and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button
                onClick={onEditToggle}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 transition-all duration-200"
                size="lg"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={onEditToggle}
                  variant="outline"
                  className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  size="lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading || isSaving || hasErrors}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  size="lg"
                >
                  {loading || isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
        
        {hasErrors && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Please fix the following errors:</span>
            </div>
            <ul className="space-y-1 pl-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field} className="text-sm text-red-600 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                  <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span> {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

     
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full blur-xl opacity-10" />
          <Avatar className="h-28 w-28 ring-4 ring-white shadow-2xl relative">
            <AvatarImage 
              src={imagePreview || user.profileImage || "/placeholder-avatar.png"} 
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">
              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label 
              htmlFor="profile-image-upload"
              className="absolute -bottom-1 -right-1 h-11 w-11 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 active:scale-95"
              title="Upload new photo"
            >
              <Upload className="h-5 w-5 text-white" />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-gray-900 mb-1">Profile Photo</h3>
          <p className="text-sm text-gray-500 mb-4">Recommended: Square PNG, JPEG, max 5MB</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {isEditing && selectedImage && (
              <>
                <Button 
                  onClick={handleSaveImage}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                  size="sm"
                >
                  <Save className="h-4 w-4" />
                  Save Photo
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview(user.profileImage || "")
                  }}
                  variant="outline"
                  className="gap-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
            {!isEditing && (
              <Button 
                variant="outline" 
                className="gap-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                size="sm"
                onClick={() => document.getElementById('profile-image-upload')?.click()}
              >
                <Upload className="h-4 w-4" />
                Change Photo
              </Button>
            )}
          </div>
          {selectedImage && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <span className="text-xs text-gray-500">
                {(getFieldValue('fullName') as string)?.length || 0}/100
              </span>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="fullName"
                    value={getFieldValue('fullName') as string}
                    onChange={(e) => handleFieldChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Enter your full name"
                    className={getFieldClasses('fullName', 'pl-10')}
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                </div>
                {shouldShowError('fullName') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.fullName}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <Input 
                  id="fullName" 
                  value={user.fullName}
                  readOnly
                  className="bg-gray-50/70 border-gray-300 pl-10"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              {isEmailVerified && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-2 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                value={user.email}
                readOnly
                className="bg-gray-50/70 border-gray-300 pl-10"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onVerifyEmail}
                disabled={emailVerificationSent}
                className="text-xs mt-1"
              >
                {emailVerificationSent ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1.5" />
                    Verification Sent
                  </>
                ) : (
                  "Change Email"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Row 2: Current Job & Years of Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="currentJob" className="text-sm font-medium text-gray-700">
                Current Job / Title
              </Label>
              <span className="text-xs text-gray-500">
                {(getFieldValue('currentJob') as string)?.length || 0}/100
              </span>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="currentJob"
                    value={getFieldValue('currentJob') as string}
                    onChange={(e) => handleFieldChange("currentJob", e.target.value)}
                    onBlur={() => handleBlur("currentJob")}
                    placeholder="e.g., Senior Software Engineer"
                    className={getFieldClasses('currentJob', 'pl-10')}
                  />
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                </div>
                {shouldShowError('currentJob') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.currentJob}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <Input 
                  id="currentJob" 
                  value={getDisplayValue('currentJob')}
                  readOnly
                  className="bg-gray-50/70 border-gray-300 pl-10"
                />
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
              Years of Experience
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Select
                    value={(getFieldValue('experienceYears') as string) || ""}
                    onValueChange={(value) => handleFieldChange("experienceYears", value)}
                  >
                    <SelectTrigger className={getFieldClasses('experienceYears', 'pl-10')}>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      {experienceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors z-10" />
                </div>
                {shouldShowError('experienceYears') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.experienceYears}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <Input 
                  id="experience" 
                  value={getDisplayValue('experienceYears')}
                  readOnly
                  className="bg-gray-50/70 border-gray-300 pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Education Level & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="education" className="text-sm font-medium text-gray-700">
              Education Level
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <Select
                  value={(getFieldValue('educationLevel') as string) || ""}
                  onValueChange={(value) => handleFieldChange("educationLevel", value)}
                >
                  <SelectTrigger className={getFieldClasses('educationLevel')}>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD/Doctorate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {shouldShowError('educationLevel') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.educationLevel}</span>
                  </div>
                )}
              </div>
            ) : (
              <Input 
                id="education" 
                value={getDisplayValue('educationLevel')}
                readOnly
                className="bg-gray-50/70 border-gray-300"
              />
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Gender
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <Select
                  value={(getFieldValue('gender') as string) || ""}
                  onValueChange={(value) => handleFieldChange("gender", value)}
                >
                  <SelectTrigger className={getFieldClasses('gender')}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {shouldShowError('gender') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.gender}</span>
                  </div>
                )}
              </div>
            ) : (
              <Input 
                id="gender" 
                value={getDisplayValue('gender')}
                readOnly
                className="bg-gray-50/70 border-gray-300"
              />
            )}
          </div>
        </div>

        {/* Row 4: Location & Preferred Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="currentLocation" className="text-sm font-medium text-gray-700">
                Current Location
              </Label>
              <span className="text-xs text-gray-500">
                {(getFieldValue('currentJobLocation') as string)?.length || 0}/100
              </span>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="currentLocation"
                    value={getFieldValue('currentJobLocation') as string}
                    onChange={(e) => handleFieldChange("currentJobLocation", e.target.value)}
                    onBlur={() => handleBlur("currentJobLocation")}
                    placeholder="e.g., San Francisco, CA"
                    className={getFieldClasses('currentJobLocation', 'pl-10')}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                </div>
                {shouldShowError('currentJobLocation') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.currentJobLocation}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <Input 
                  id="currentLocation" 
                  value={getDisplayValue('currentJobLocation')}
                  readOnly
                  className="bg-gray-50/70 border-gray-300 pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="preferredLocations" className="text-sm font-medium text-gray-700">
              Preferred Job Locations
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="preferredLocations"
                    value={Array.isArray(getFieldValue('preferredJobLocation')) 
                      ? (getFieldValue('preferredJobLocation') as string[]).join(", ") 
                      : ""}
                    onChange={(e) => handleFieldChange("preferredJobLocation", e.target.value)}
                    onBlur={() => handleBlur("preferredJobLocation")}
                    placeholder="e.g., San Francisco, CA, New York, NY, Remote"
                    className={getFieldClasses('preferredJobLocation', 'pl-10')}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                </div>
                {shouldShowError('preferredJobLocation') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.preferredJobLocation}</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Separate locations with commas</p>
                {Array.isArray(getFieldValue('preferredJobLocation')) && 
                 (getFieldValue('preferredJobLocation') as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(getFieldValue('preferredJobLocation') as string[]).map((location, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {location.trim()}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('preferredJobLocation', index)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Input 
                    id="preferredLocations" 
                    value={getDisplayValue('preferredJobLocation')}
                    readOnly
                    className="bg-gray-50/70 border-gray-300 pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {Array.isArray(candidateProfile.preferredJobLocation) && 
                 candidateProfile.preferredJobLocation.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {candidateProfile.preferredJobLocation.map((location, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {location}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
              Skills
            </Label>
            {isEditing && (
              <span className="text-xs text-gray-500">
                {Array.isArray(getFieldValue('skills')) 
                  ? (getFieldValue('skills') as string[]).length 
                  : 0}/50 skills
              </span>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                id="skills"
                value={Array.isArray(getFieldValue('skills')) 
                  ? (getFieldValue('skills') as string[]).join(", ") 
                  : ""}
                onChange={(e) => handleFieldChange("skills", e.target.value)}
                onBlur={() => handleBlur("skills")}
                placeholder="Add your skills separated by commas (e.g., JavaScript, React, Node.js, Python)"
                className={getFieldClasses('skills', 'min-h-[100px]')}
              />
              {shouldShowError('skills') && (
                <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="leading-tight">{validationErrors.skills}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {Array.isArray(getFieldValue('skills')) && 
                 (getFieldValue('skills') as string[]).map((skill, index) => (
                  <Badge key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                    {skill.trim()}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('skills', index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Separate skills with commas. Click on a skill to remove it.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                id="skills"
                value={getDisplayValue('skills')}
                readOnly
                className="bg-gray-50/70 border-gray-300"
              />
              {Array.isArray(candidateProfile.skills) && candidateProfile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.skills.map((skill, index) => (
                    <Badge key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 border-blue-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 6: Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
              LinkedIn URL
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="linkedin"
                    value={getFieldValue('linkedinUrl') as string}
                    onChange={(e) => handleFieldChange("linkedinUrl", e.target.value)}
                    onBlur={() => handleBlur("linkedinUrl")}
                    placeholder="https://linkedin.com/in/username"
                    className={getFieldClasses('linkedinUrl', 'pl-10')}
                  />
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A66C2] group-hover:text-[#0A66C2]/80 transition-colors" />
                </div>
                {shouldShowError('linkedinUrl') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.linkedinUrl}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Input 
                    id="linkedin" 
                    value={getDisplayValue('linkedinUrl')}
                    readOnly
                    className="bg-gray-50/70 border-gray-300 pl-10"
                  />
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A66C2]" />
                </div>
                {candidateProfile.linkedinUrl && isValidUrl(candidateProfile.linkedinUrl) && (
                  <a 
                    href={candidateProfile.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit LinkedIn profile
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700">
              Portfolio Website
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Input
                    id="portfolio"
                    value={getFieldValue('portfolioUrl') as string}
                    onChange={(e) => handleFieldChange("portfolioUrl", e.target.value)}
                    onBlur={() => handleBlur("portfolioUrl")}
                    placeholder="https://yourportfolio.com"
                    className={getFieldClasses('portfolioUrl', 'pl-10')}
                  />
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                </div>
                {shouldShowError('portfolioUrl') && (
                  <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="leading-tight">{validationErrors.portfolioUrl}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Input 
                    id="portfolio" 
                    value={getDisplayValue('portfolioUrl')}
                    readOnly
                    className="bg-gray-50/70 border-gray-300 pl-10"
                  />
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {candidateProfile.portfolioUrl && isValidUrl(candidateProfile.portfolioUrl) && (
                  <a 
                    href={candidateProfile.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Additional Information
            </Label>
            {isEditing && (
              <span className={cn(
                "text-xs",
                (getFieldValue('bio') as string)?.length > 500 ? 'text-red-600' : 'text-gray-500'
              )}>
                {(getFieldValue('bio') as string)?.length || 0}/500
              </span>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Tell us more about yourself, your career goals, or anything else you'd like to share..."
                className={getFieldClasses('bio', 'min-h-[140px]')}
                value={getFieldValue('bio') as string}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                onBlur={() => handleBlur("bio")}
              />
              {shouldShowError('bio') && (
                <div className="flex items-center gap-1.5 text-red-600 text-sm px-1 animate-fadeIn">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="leading-tight">{validationErrors.bio}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Optional: Share more about yourself (max 500 characters)</p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50/70 rounded-lg border border-gray-300 min-h-[140px]">
              <p className="text-gray-700 whitespace-pre-wrap">
                {candidateProfile.bio || "No additional information provided."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button for Mobile */}
      {isEditing && (
        <div className="sticky bottom-6 mt-8 md:hidden">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-xl shadow-black/5">
            <Button
              onClick={onEditToggle}
              variant="outline"
              className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || isSaving || hasErrors}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}