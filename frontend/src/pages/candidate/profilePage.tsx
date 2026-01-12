import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Mail,
  Linkedin,
  Link2,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Settings,
  User,
  Calendar,
  Globe,
  DollarSign,
  Clock,
  Building2,
  Heart,
  Loader2,
  Award,
  Users,
  Target,
  Star,
  Zap,
  Edit,
  Save,
  X,
  AlertCircle,
} from "lucide-react"
import { candidateService } from "@/services/candidate/candidate.service"
import type {
  CandidateProfileResponse,
  UpdateCandidateProfilePayload,
} from "@/types/candidate/candidate.profile.type"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const tabs = [
  { id: "About", icon: User },
  { id: "Experience", icon: Briefcase },
  { id: "Education", icon: GraduationCap },
  { id: "Skills", icon: Sparkles },
  { id: "Resume", icon: FileText },
  { id: "Settings", icon: Settings },
]

export default function CandidateProfilePage() {
  const [activeTab, setActiveTab] = useState("About")
  const [profile, setProfile] = useState<CandidateProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UpdateCandidateProfilePayload>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await candidateService.getProfile()
      setProfile(data)
      setError(null)
    } catch (err) {
      setError("Failed to load profile. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    navigate("/candidate/home")
  }

  const handleSettingsClick = () => {
    navigate("/candidate/profile/setting")
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      setEditData({})
    } else {
      // Start edit - populate editData with current profile data
      if (profile) {
        setEditData({
          currentJob: profile.candidateProfile.currentJob,
          experienceYears: profile.candidateProfile.experienceYears,
          educationLevel: profile.candidateProfile.educationLevel,
          skills: profile.candidateProfile.skills,
          preferredJobLocation: profile.candidateProfile.preferredJobLocation,
          currentJobLocation: profile.candidateProfile.currentJobLocation,
          linkedinUrl: profile.candidateProfile.linkedinUrl,
        })
      }
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (field: keyof UpdateCandidateProfilePayload, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await candidateService.updateProfile(editData)
      // Refresh the profile data
      await fetchProfile()
      setIsEditing(false)
      setEditData({})
      setShowConfirmDialog(false)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveClick = () => {
    setShowConfirmDialog(true)
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Error</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button 
            onClick={fetchProfile} 
            className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const { user, candidateProfile } = profile
  const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const profileCompletion = candidateProfile.profileCompleted ? 100 : 85

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Changes
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes? This will update your public profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Back Button */}
            <div className="flex gap-2">
              <Button
                onClick={handleBackToDashboard}
                variant="ghost"
                className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              {!isEditing ? (
                <Button
                  onClick={handleEditToggle}
                  className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="relative">
                {/* Background linear */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-emerald-500/10" />
                
                {/* Profile Content */}
                <div className="relative p-6">
                  {/* Edit Mode Indicator */}
                  {isEditing && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-linear-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg shadow-amber-500/25 px-3 py-1 animate-pulse">
                        <Edit className="h-3 w-3 mr-1" />
                        Editing
                      </Badge>
                    </div>
                  )}

                  {/* Avatar with glow effect */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-emerald-500 rounded-full blur-xl opacity-30" />
                    <Avatar className="h-32 w-32 ring-4 ring-white/80 shadow-2xl relative">
                      <AvatarImage 
                        src={user.profileImage || "/professional-blonde-woman.png"} 
                        className="object-cover"
                      />
                      <AvatarFallback className="text-3xl bg-linear-to-br from-blue-600 to-emerald-600 text-white font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator with pulse */}
                    <div className="absolute bottom-2 right-2 h-5 w-5 bg-emerald-500 rounded-full ring-4 ring-white flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center mb-4">
                    <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/25 px-4 py-1.5">
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Open to Opportunities
                    </Badge>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
                      {user.fullName}
                    </h2>
                    <p className="text-slate-600 mt-2 leading-relaxed">
                      {isEditing ? (
                        <Input
                          value={editData.currentJob || candidateProfile.currentJob || ""}
                          onChange={(e) => handleInputChange("currentJob", e.target.value)}
                          placeholder="Enter your current job/title"
                          className="text-center border-slate-200 bg-white/50"
                        />
                      ) : (
                        candidateProfile.currentJob || "Senior Product Designer / Lead"
                      )}
                    </p>
                    <p className="text-sm text-slate-500">Product Designer</p>
                  </div>

                  <Separator className="my-6 bg-linear-to-r from-transparent via-slate-200 to-transparent" />

                  {/* Profile Stats */}
                  <div className="space-y-6">
                    {/* Profile Completion */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Profile Strength</span>
                        <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full relative">
                          <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/20"></div>
                        </div>
                      </div>
                    </div>

                    {/* Experience Badge */}
                    <div className="flex items-center justify-between p-4 bg-linear-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Experience</p>
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              value={editData.experienceYears || candidateProfile.experienceYears || ""}
                              onChange={(e) => handleInputChange("experienceYears", parseInt(e.target.value) || 0)}
                              placeholder="Years of experience"
                              className="w-24 border-slate-200 bg-white/50"
                            />
                          ) : (
                            <p className="text-lg font-bold text-emerald-700">
                              {candidateProfile.experienceYears ? `${candidateProfile.experienceYears}+ Years` : "8+ Years"}
                            </p>
                          )}
                        </div>
                      </div>
                      <Star className="h-5 w-5 text-emerald-400" />
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-slate-600">Companies</span>
                        </div>
                        <p className="text-lg font-bold text-blue-700">3</p>
                      </div>
                      <div className="bg-violet-50/50 p-3 rounded-xl border border-violet-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="h-4 w-4 text-violet-500" />
                          <span className="text-xs text-slate-600">Skills</span>
                        </div>
                        <p className="text-lg font-bold text-violet-700">{candidateProfile.skills?.length || 20}+</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors group">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600">Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors group">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        {isEditing ? (
                          <Input
                            value={editData.currentJobLocation || candidateProfile.currentJobLocation || ""}
                            onChange={(e) => handleInputChange("currentJobLocation", e.target.value)}
                            placeholder="Enter your location"
                            className="border-slate-200 bg-white/50"
                          />
                        ) : (
                          <>
                            <p className="text-sm font-medium text-slate-900">
                              {candidateProfile.currentJobLocation || "San Francisco, CA"}
                            </p>
                            <p className="text-xs text-slate-500">Location</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    {candidateProfile.linkedinUrl && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-all group">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <Input
                              value={editData.linkedinUrl || candidateProfile.linkedinUrl || ""}
                              onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                              placeholder="LinkedIn URL"
                              className="border-slate-200 bg-white/50"
                            />
                          ) : (
                            <>
                              <p className="text-sm font-medium text-slate-900">LinkedIn</p>
                              <p className="text-xs text-slate-500 truncate">Professional Profile</p>
                            </>
                          )}
                        </div>
                        {!isEditing && (
                          <a
                            href={candidateProfile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                          >
                            <ExternalLink className="h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
                          </a>
                        )}
                      </div>
                    )}

                    {candidateProfile.portfolioUrl && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50/50 hover:bg-violet-100/50 transition-all group">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-violet-100 to-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Link2 className="h-4 w-4 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <Input
                              value={candidateProfile.portfolioUrl || ""}
                              readOnly
                              placeholder="Portfolio URL"
                              className="border-slate-200 bg-white/50"
                            />
                          ) : (
                            <>
                              <p className="text-sm font-medium text-slate-900">Portfolio</p>
                              <p className="text-xs text-slate-500 truncate">Design Work</p>
                            </>
                          )}
                        </div>
                        {!isEditing && (
                          <a
                            href={candidateProfile.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                          >
                            <ExternalLink className="h-4 w-4 text-violet-400 group-hover:text-violet-600 transition-colors" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    {isEditing ? (
                      <Button
                        onClick={handleSaveClick}
                        className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 group"
                      >
                        <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        Save Changes
                      </Button>
                    ) : (
                      <Button className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group">
                        <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        Download Resume PDF
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full border-slate-200/80 bg-white/50 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group"
                    >
                      <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Share Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-200/80 bg-white/50 hover:bg-white hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300 group"
                    >
                      <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      View Public Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header with Tabs */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              {/* Tab Navigation */}
              <div className="px-6 pt-6">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => tab.id === "Settings" ? handleSettingsClick() : setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{tab.id}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6">
                {activeTab === "About" && (
                  <AboutTab 
                    profile={profile} 
                    isEditing={isEditing} 
                    editData={editData} 
                    onInputChange={handleInputChange} 
                  />
                )}
                {activeTab === "Experience" && <ExperienceTab />}
                {activeTab === "Education" && <EducationTab />}
                {activeTab === "Skills" && (
                  <SkillsTab 
                    skills={candidateProfile.skills}
                    isEditing={isEditing}
                    editData={editData}
                    onInputChange={handleInputChange}
                  />
                )}
                {activeTab === "Resume" && <ResumeTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AboutTabProps {
  profile: CandidateProfileResponse;
  isEditing: boolean;
  editData: UpdateCandidateProfilePayload;
  onInputChange: (field: keyof UpdateCandidateProfilePayload, value: any) => void;
}

function AboutTab({ profile, isEditing, editData, onInputChange }: AboutTabProps) {
  const { user, candidateProfile } = profile

  return (
    <div className="space-y-6">
      {/* Professional Summary */}
      <div className="bg-linear-to-br from-blue-50/50 to-blue-100/30 rounded-2xl p-6 border border-blue-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Professional Summary</h3>
            <p className="text-sm text-slate-500">A brief overview of your career journey</p>
          </div>
        </div>
        {isEditing ? (
          <Textarea
            value={editData.currentJob || candidateProfile.currentJob || ""}
            onChange={(e) => onInputChange("currentJob", e.target.value)}
            placeholder="Enter your professional summary..."
            className="min-h-30 border-slate-200 bg-white/50"
            rows={4}
          />
        ) : (
          <p className="text-slate-700 leading-relaxed">
            {candidateProfile.currentJob || "Highly accomplished Senior Product Designer with 8 years of experience leading end-to-end product design cycles from ideation to launch. Specializes in creating intuitive, user-centric experiences for SaaS platforms and mobile applications."}
          </p>
        )}
      </div>

      {/* Personal Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white/80 rounded-2xl p-6 border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personal Details</h3>
          </div>
          <div className="space-y-4">
            <DetailItem 
              icon={User} 
              label="Full Name" 
              value={user.fullName} 
              isEditing={false} 
            />
            <DetailItem icon={Calendar} label="Date of Birth" value="1990-05-15" isEditing={false} />
            <DetailItem 
              icon={User} 
              label="Gender" 
              value={candidateProfile.gender || "Female"} 
              isEditing={false} 
            />
            <DetailItem icon={Globe} label="Nationality" value="American" isEditing={false} />
            <DetailItem icon={FileText} label="Visa Status" value="US Citizen" isEditing={false} />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white/80 rounded-2xl p-6 border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Preferences</h3>
          </div>
          <div className="space-y-4">
            <DetailItem 
              icon={MapPin} 
              label="Willing to Relocate" 
              value="Yes" 
              badgeColor="emerald"
              isEditing={false}
            />
            <DetailItem 
              icon={Clock} 
              label="Notice Period" 
              value="2 weeks" 
              isEditing={false}
            />
            <DetailItem 
              icon={DollarSign} 
              label="Expected Salary" 
              value="USD 150,000 - 180,000" 
              isEditing={false}
            />
            <DetailItem 
              icon={Building2} 
              label="Education Level" 
              value={candidateProfile.educationLevel || "Master's Degree"} 
              badgeColor="blue"
              isEditing={isEditing}
              editValue={editData.educationLevel}
              onChange={(value) => onInputChange("educationLevel", value)}
            />
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white/80 rounded-2xl p-6 border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Languages</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5">
              English (Native)
            </Badge>
            <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5">
              Spanish (Intermediate)
            </Badge>
          </div>
        </div>

        {/* Work Preferences */}
        <div className="bg-white/80 rounded-2xl p-6 border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Work Preferences</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-2">Preferred Job Type</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white">Full-time</Badge>
                <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white">Contract</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Work Mode</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-linear-to-r from-slate-600 to-slate-700 text-white">Remote</Badge>
                <Badge className="bg-linear-to-r from-slate-600 to-slate-700 text-white">Hybrid</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Preferences */}
      <div className="bg-linear-to-br from-emerald-50/50 to-emerald-100/30 rounded-2xl p-6 border border-emerald-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Career Preferences</h3>
            <p className="text-sm text-slate-500">Your ideal work environment and goals</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Preferred Industries</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white">Technology</Badge>
                <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white">Fintech</Badge>
                <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white">Healthcare</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Company Size</p>
              <p className="text-slate-900 font-medium">501-1000 employees</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Preferred Locations</p>
              {isEditing ? (
                <Input
                  value={editData.preferredJobLocation?.join(", ") || candidateProfile.preferredJobLocation?.join(", ") || ""}
                  onChange={(e) => onInputChange("preferredJobLocation", e.target.value.split(", "))}
                  placeholder="e.g., San Francisco, CA, New York, NY"
                  className="border-slate-200 bg-white/50"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.preferredJobLocation?.map((location, index) => (
                    <Badge key={index} className="bg-linear-to-r from-blue-500 to-blue-600 text-white">
                      {location}
                    </Badge>
                  )) || (
                    <>
                      <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white">San Francisco, CA</Badge>
                      <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white">New York, NY</Badge>
                    </>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Deal Breakers</p>
              <p className="text-slate-600 text-sm">
                Lack of design ownership, unhealthy work-life balance, companies without a clear product vision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  badgeColor?: "blue" | "emerald" | "slate";
  isEditing?: boolean;
  editValue?: string;
  onChange?: (value: string) => void;
}

function DetailItem({ 
  icon: Icon, 
  label, 
  value, 
  badgeColor = "slate",
  isEditing = false,
  editValue,
  onChange
}: DetailItemProps) {
  const badgeColors = {
    blue: "bg-linear-to-r from-blue-500 to-blue-600 text-white",
    emerald: "bg-linear-to-r from-emerald-500 to-emerald-600 text-white",
    slate: "bg-linear-to-r from-slate-600 to-slate-700 text-white",
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-slate-400" />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      {isEditing && onChange ? (
        <Input
          value={editValue || value}
          onChange={(e) => onChange(e.target.value)}
          className="w-48 border-slate-200 bg-white/50"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <Badge className={`${badgeColors[badgeColor]} px-3 py-1`}>
          {value}
        </Badge>
      )}
    </div>
  )
}

function ExperienceTab() {
  const experiences = [
    {
      title: "Senior Product Designer",
      company: "TechCorp Inc.",
      period: "2021 - Present",
      description: "Leading design initiatives for enterprise SaaS products, managing a team of 4 designers.",
      type: "Full-time",
      achievements: ["Led redesign of flagship product", "Increased user engagement by 40%", "Built design system used by 50+ designers"],
    },
    {
      title: "Product Designer",
      company: "StartupXYZ",
      period: "2018 - 2021",
      description: "Designed mobile-first experiences for fintech applications serving 2M+ users.",
      type: "Full-time",
      achievements: ["Designed award-winning mobile app", "Reduced user drop-off by 25%", "Collaborated with engineering on 10+ releases"],
    },
    {
      title: "UI/UX Designer",
      company: "Design Agency Co.",
      period: "2016 - 2018",
      description: "Created user interfaces for various clients across healthcare and e-commerce sectors.",
      type: "Full-time",
      achievements: ["Worked with 15+ clients", "Delivered 30+ projects on time", "Improved client satisfaction scores by 35%"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Work Experience</h3>
          <p className="text-sm text-slate-500">Your professional journey and achievements</p>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-linear-to-br from-white to-blue-50/30 border border-blue-100/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{exp.title}</h4>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                </div>
                <p className="text-slate-600">{exp.description}</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className="bg-linear-to-r from-slate-600 to-slate-700 text-white">
                  {exp.type}
                </Badge>
                <p className="text-sm font-medium text-slate-500">{exp.period}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Key Achievements:</p>
              <ul className="space-y-1">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EducationTab() {
  const education = [
    {
      degree: "Master of Fine Arts in Interaction Design",
      school: "California College of the Arts",
      period: "2014 - 2016",
      description: "Focused on human-centered design and design thinking methodologies.",
      gpa: "3.9/4.0",
      honors: ["Dean's List", "Design Excellence Award"],
    },
    {
      degree: "Bachelor of Arts in Graphic Design",
      school: "University of California, Los Angeles",
      period: "2010 - 2014",
      description: "Dean's List. Minor in Computer Science.",
      gpa: "3.8/4.0",
      honors: ["Summa Cum Laude", "President's Scholarship"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Education</h3>
          <p className="text-sm text-slate-500">Your academic background and achievements</p>
        </div>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <div
            key={index}
            className="bg-linear-to-br from-white to-emerald-50/30 border border-emerald-100/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-emerald-600 font-medium">{edu.school}</p>
                  </div>
                </div>
                <p className="text-slate-600">{edu.description}</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white">
                  GPA: {edu.gpa}
                </Badge>
                <p className="text-sm font-medium text-slate-500">{edu.period}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Honors & Awards:</p>
              <div className="flex flex-wrap gap-2">
                {edu.honors.map((honor, i) => (
                  <Badge key={i} className="bg-linear-to-r from-slate-600 to-slate-700 text-white">
                    {honor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SkillsTabProps {
  skills?: string[];
  isEditing: boolean;
  editData: UpdateCandidateProfilePayload;
  onInputChange: (field: keyof UpdateCandidateProfilePayload, value: any) => void;
}

function SkillsTab({ skills, isEditing, editData, onInputChange }: SkillsTabProps) {
  const skillCategories = [
    {
      category: "Design Tools",
      icon: Sparkles,
      color: "blue",
      skills: skills?.filter(s => ["Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator", "After Effects"].includes(s)) 
        || ["Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator", "After Effects"],
    },
    {
      category: "Prototyping",
      icon: Zap,
      color: "violet",
      skills: ["Principle", "Framer", "InVision", "Marvel"],
    },
    {
      category: "Research & Testing",
      icon: Target,
      color: "emerald",
      skills: ["User Interviews", "A/B Testing", "Usability Testing", "Survey Design"],
    },
    {
      category: "Technical Skills",
      icon: Briefcase,
      color: "amber",
      skills: ["HTML/CSS", "Basic JavaScript", "Design Systems", "Responsive Design"],
    },
  ]

  const colorMap: Record<string, { bg: string; badge: string; icon: string }> = {
    blue: { 
      bg: "bg-linear-to-br from-blue-50 to-blue-100/30", 
      badge: "bg-linear-to-r from-blue-500 to-blue-600 text-white",
      icon: "text-blue-600"
    },
    violet: { 
      bg: "bg-linear-to-br from-violet-50 to-violet-100/30", 
      badge: "bg-linear-to-r from-violet-500 to-violet-600 text-white",
      icon: "text-violet-600"
    },
    emerald: { 
      bg: "bg-linear-to-br from-emerald-50 to-emerald-100/30", 
      badge: "bg-linear-to-r from-emerald-500 to-emerald-600 text-white",
      icon: "text-emerald-600"
    },
    amber: { 
      bg: "bg-linear-to-br from-amber-50 to-amber-100/30", 
      badge: "bg-linear-to-r from-amber-500 to-amber-600 text-white",
      icon: "text-amber-600"
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Skills & Expertise</h3>
          <p className="text-sm text-slate-500">Your technical and professional capabilities</p>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-linear-to-br from-white to-violet-50/30 border border-violet-100/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Edit Skills</h4>
          </div>
          <Textarea
            value={editData.skills?.join(", ") || skills?.join(", ") || ""}
            onChange={(e) => onInputChange("skills", e.target.value.split(", ").map(s => s.trim()))}
            placeholder="Enter your skills separated by commas (e.g., Figma, Sketch, HTML/CSS)"
            className="min-h-30 border-slate-200 bg-white/50"
            rows={4}
          />
          <p className="text-sm text-slate-500 mt-2">Separate skills with commas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((cat, index) => {
            const colors = colorMap[cat.color]
            const Icon = cat.icon
            return (
              <div
                key={index}
                className={`${colors.bg} border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-lg ${colors.icon} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{cat.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, i) => (
                    <Badge key={i} className={`${colors.badge} px-3 py-1.5`}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ResumeTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Resume</h3>
          <p className="text-sm text-slate-500">Download or view your professional resume</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-white to-rose-50/30 border border-rose-100/50 rounded-2xl p-8 text-center">
        <div className="w-24 h-24 bg-linear-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/25">
          <FileText className="h-12 w-12 text-white" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">Samantha_Reynolds_Resume.pdf</h4>
        <p className="text-sm text-slate-500 mb-2">Professional Resume</p>
        <p className="text-xs text-slate-400 mb-6">Last updated: January 5, 2024 • 2.4 MB</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/25 group">
            <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Download Resume
          </Button>
          <Button variant="outline" className="border-slate-200 hover:border-rose-200 hover:text-rose-600 bg-white/50">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Online
          </Button>
        </div>
      </div>
    </div>
  )
}