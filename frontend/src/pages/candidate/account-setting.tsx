"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LayoutDashboard,
  Building2,
  User,
  Briefcase,
  MessageSquare,
  FileText,
  Upload,
  Linkedin,
  Globe,
  MapPin,
  CheckCircle,
  Calendar,
  Loader2,
  Save,
  Shield,
  Bell,
  Lock,
  X,
} from "lucide-react"
import { candidateService } from "@/services/candidate/candidate.service"
import type {
  CandidateProfileResponse,
  UpdateCandidateProfilePayload,
} from "@/types/candidate/candidate.profile.type"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Building2, label: "My Applications", href: "#" },
  { icon: User, label: "My Profile", href: "#", active: true },
  { icon: Briefcase, label: "Jobs", href: "#" },
  { icon: MessageSquare, label: "MY Interviews", href: "#" },
  { icon: FileText, label: "Resume", href: "#" },
]

const settingsTabs = ["Personal Info", "Security", "Notifications", "Privacy"]

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("Personal Info")
  const [profile, setProfile] = useState<CandidateProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UpdateCandidateProfilePayload>({})
  const [error,setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await candidateService.getProfile()
      setProfile(data)
      setError("")
    } catch (err) {
      setError("Failed to load profile. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
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
          linkedinUrl: profile.candidateProfile.linkedinUrl,
        })
      }
    }
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await candidateService.updateProfile(editData)
      // Refresh the profile data
      await fetchProfile()
      setIsEditing(false)
      setEditData({})
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UpdateCandidateProfilePayload, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!profile) return null

  const { user } = profile
  const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex">
      {/* Left Sidebar */}
      <aside className="w-56 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="h-8 w-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-blue-600">RecruitIQ</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.href === "/" ? navigate("/") : null}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                item.active
                  ? "bg-linear-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
              <AvatarImage src={user.profileImage || "/professional-dark-haired-man.png"} />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Profile</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Edit</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
              <p className="text-gray-500">Manage your profile and preferences</p>
            </div>
            {isEditing && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  className="border-gray-200 hover:border-gray-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Settings Tabs */}
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl p-1 inline-flex mb-8 border border-gray-200/50">
            {settingsTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-white text-gray-900 shadow-lg shadow-gray-200/50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab === "Personal Info" && <User className="h-4 w-4" />}
                {tab === "Security" && <Shield className="h-4 w-4" />}
                {tab === "Notifications" && <Bell className="h-4 w-4" />}
                {tab === "Privacy" && <Lock className="h-4 w-4" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Personal Information Form */}
          {activeTab === "Personal Info" && (
            <PersonalInfoForm 
              profile={profile} 
              isEditing={isEditing} 
              editData={editData}
              onInputChange={handleInputChange}
              onEditToggle={handleEditToggle}
            />
          )}
          {activeTab === "Security" && <SecuritySection />}
          {activeTab === "Notifications" && <NotificationsSection />}
          {activeTab === "Privacy" && <PrivacySection />}
        </div>
      </main>
    </div>
  )
}

interface PersonalInfoFormProps {
  profile: CandidateProfileResponse;
  isEditing: boolean;
  editData: UpdateCandidateProfilePayload;
  onInputChange: (field: keyof UpdateCandidateProfilePayload, value: any) => void;
  onEditToggle: () => void;
}

function PersonalInfoForm({ profile, isEditing, editData, onInputChange, onEditToggle }: PersonalInfoFormProps) {
  const { user, candidateProfile } = profile

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-500">Manage your profile details and preferences</p>
          </div>
          {!isEditing && (
            <Button
              onClick={onEditToggle}
              variant="outline"
              className="border-gray-200 hover:border-gray-300 hover:text-blue-600"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-blue-600 rounded-full blur-md opacity-20" />
          <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl relative">
            <AvatarImage src={user.profileImage || "/professional-dark-haired-man.png"} />
            <AvatarFallback className="text-2xl bg-linear-to-br from-blue-500 to-blue-600 text-white font-bold">
              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Profile Photo</h3>
          <p className="text-sm text-gray-500 mb-3">Recommended: Square PNG, JPEG, max 5MB</p>
          <Button variant="outline" className="gap-2 border-gray-200 hover:border-gray-300">
            <Upload className="h-4 w-4" />
            Change Photo
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <div className="relative">
              <Input 
                id="fullName" 
                value={user.fullName}
                readOnly
                className="bg-gray-50/50 border-gray-200 pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={user.email}
                readOnly
                className="bg-gray-50/50 border-gray-200 pl-10 pr-24"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Current Job & Years of Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="currentJob" className="text-sm font-medium text-gray-700">
              Current Job / Title
            </Label>
            {isEditing ? (
              <Input
                id="currentJob"
                value={editData.currentJob || candidateProfile.currentJob || ""}
                onChange={(e) => onInputChange("currentJob", e.target.value)}
                placeholder="Enter your current job title"
                className="bg-white border-gray-200"
              />
            ) : (
              <div className="relative">
                <Input 
                  id="currentJob" 
                  value={candidateProfile.currentJob || "Not specified"}
                  readOnly
                  className="bg-gray-50/50 border-gray-200 pl-10"
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
              <div className="relative">
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={editData.experienceYears || candidateProfile.experienceYears || ""}
                  onChange={(e) => onInputChange("experienceYears", parseInt(e.target.value) || 0)}
                  placeholder="Enter years of experience"
                  className="bg-white border-gray-200 pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            ) : (
              <div className="relative">
                <Input 
                  id="experience" 
                  value={candidateProfile.experienceYears ? `${candidateProfile.experienceYears} years` : "Not specified"}
                  readOnly
                  className="bg-gray-50/50 border-gray-200 pl-10"
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
              <Select
                value={editData.educationLevel || candidateProfile.educationLevel || ""}
                onValueChange={(value) => onInputChange("educationLevel", value)}
              >
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="associate">Associate Degree</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input 
                id="education" 
                value={candidateProfile.educationLevel || "Not specified"}
                readOnly
                className="bg-gray-50/50 border-gray-200"
              />
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Gender
            </Label>
            <Input 
              id="gender" 
              value={candidateProfile.gender || "Not specified"}
              readOnly
              className="bg-gray-50/50 border-gray-200"
            />
          </div>
        </div>

        {/* Row 4: Location & Preferred Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="currentLocation" className="text-sm font-medium text-gray-700">
              Current Location
            </Label>
            <div className="relative">
              <Input 
                id="currentLocation" 
                value={candidateProfile.currentJobLocation || "Not specified"}
                readOnly
                className="bg-gray-50/50 border-gray-200 pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="preferredLocations" className="text-sm font-medium text-gray-700">
              Preferred Job Locations
            </Label>
            {isEditing ? (
              <Input
                id="preferredLocations"
                value={editData.preferredJobLocation?.join(", ") || candidateProfile.preferredJobLocation?.join(", ") || ""}
                onChange={(e) => onInputChange("preferredJobLocation", e.target.value.split(", "))}
                placeholder="e.g., San Francisco, CA, New York, NY"
                className="bg-white border-gray-200 pl-10"
              />
            ) : (
              <div className="relative">
                <Input 
                  id="preferredLocations" 
                  value={candidateProfile.preferredJobLocation?.join(", ") || "Not specified"}
                  readOnly
                  className="bg-gray-50/50 border-gray-200 pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Row 5: Skills */}
        <div className="space-y-3">
          <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
            Skills
          </Label>
          {isEditing ? (
            <Input
              id="skills"
              value={editData.skills?.join(", ") || candidateProfile.skills?.join(", ") || ""}
              onChange={(e) => onInputChange("skills", e.target.value.split(", ").map(s => s.trim()))}
              placeholder="Add your skills (separate with commas)"
              className="bg-white border-gray-200 max-w-md"
            />
          ) : (
            <Input
              id="skills"
              value={candidateProfile.skills?.join(", ") || "No skills added"}
              readOnly
              className="bg-gray-50/50 border-gray-200 max-w-md"
            />
          )}
          <p className="text-xs text-gray-500">Separate skills with commas</p>
        </div>

        {/* Row 6: Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
              LinkedIn URL
            </Label>
            {isEditing ? (
              <div className="relative">
                <Input
                  id="linkedin"
                  value={editData.linkedinUrl || candidateProfile.linkedinUrl || ""}
                  onChange={(e) => onInputChange("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-white border-gray-200 pl-10"
                />
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
              </div>
            ) : (
              <div className="relative">
                <Input 
                  id="linkedin" 
                  value={candidateProfile.linkedinUrl || "Not added"}
                  readOnly
                  className="bg-gray-50/50 border-gray-200 pl-10"
                />
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700">
              Portfolio Website
            </Label>
            <div className="relative">
              <Input 
                id="portfolio" 
                value={candidateProfile.portfolioUrl || "Not added"}
                readOnly
                className="bg-gray-50/50 border-gray-200 pl-10"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-sm text-gray-500">Manage your password and security preferences</p>
      </div>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
            <p className="text-sm text-gray-500">Protect your account with strong security measures</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-linear-to-br from-blue-50/50 to-blue-100/30 rounded-xl border border-blue-100/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" className="border-gray-200 hover:border-gray-300">
                Change Password
              </Button>
            </div>
          </div>

          <div className="p-6 bg-linear-to-br from-emerald-50/50 to-emerald-100/30 rounded-xl border border-emerald-100/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Button className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                Enable 2FA
              </Button>
            </div>
          </div>

          <div className="p-6 bg-linear-to-br from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Sessions</h4>
                <p className="text-sm text-gray-500">Manage active sessions across devices</p>
              </div>
              <Button variant="outline" className="border-gray-200 hover:border-gray-300">
                View Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500">Control how and when you receive notifications</p>
      </div>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            <p className="text-sm text-gray-500">Customize your notification preferences</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {[
            { title: "Job Alerts", desc: "New job recommendations matching your profile" },
            { title: "Application Updates", desc: "Status changes on your applications" },
            { title: "Interview Invites", desc: "New interview requests and schedule changes" },
            { title: "Profile Views", desc: "When recruiters view your profile" },
            { title: "Messages", desc: "New messages from recruiters" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50">
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Email</span>
                <div className="h-6 w-11 bg-blue-500 rounded-full relative">
                  <div className="h-4 w-4 bg-white rounded-full absolute right-1 top-1" />
                </div>
                <span className="text-sm text-gray-500">Push</span>
                <div className="h-6 w-11 bg-gray-200 rounded-full relative">
                  <div className="h-4 w-4 bg-white rounded-full absolute left-1 top-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PrivacySection() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
        <p className="text-sm text-gray-500">Control your profile visibility and data sharing preferences</p>
      </div>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Privacy & Data</h3>
            <p className="text-sm text-gray-500">Manage your privacy settings and data preferences</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {[
            { title: "Profile Visibility", desc: "Control who can see your profile", status: "Public" },
            { title: "Contact Information", desc: "Who can see your contact details", status: "Recruiters Only" },
            { title: "Resume Download", desc: "Allow recruiters to download your resume", status: "Enabled" },
            { title: "Data Sharing", desc: "Share profile data with partner companies", status: "Limited" },
            { title: "Activity Status", desc: "Show when you're active on the platform", status: "Visible" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50">
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                <Button variant="outline" className="border-gray-200 hover:border-gray-300 text-sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

function setError(arg0: null) {
    throw new Error("Function not implemented.")
}
