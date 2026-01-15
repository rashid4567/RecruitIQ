"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CandidateSidebar from "../../../components/sidebar/candidateSidebar"
import {
  Loader2,
  User,
  Shield,
  Bell,
  Lock,
} from "lucide-react"
import { candidateService } from "@/services/candidate/candidate.service"
import type {
  CandidateProfileResponse,
  UpdateCandidateProfileRequest,
} from "@/types/candidate/candidate.profile.type"
import { toast } from "sonner"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { SecuritySection } from "./SecuritySection"
import { NotificationsSection } from "./NotificationsSection"
import { PrivacySection } from "./PrivacySection"

const settingsTabs = ["Personal Info", "Security", "Notifications", "Privacy"]

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("Personal Info")
  const [profile, setProfile] = useState<CandidateProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UpdateCandidateProfileRequest>({})
  const [error, setError] = useState("")
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
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
          fullName: profile.user.fullName,
          profileImage: profile.user.profileImage,
          currentJob: profile.candidateProfile.currentJob,
          experienceYears: profile.candidateProfile.experienceYears,
          educationLevel: profile.candidateProfile.educationLevel,
          skills: profile.candidateProfile.skills,
          preferredJobLocation: profile.candidateProfile.preferredJobLocation,
          currentJobLocation: profile.candidateProfile.currentJobLocation,
          linkedinUrl: profile.candidateProfile.linkedinUrl,
          gender: profile.candidateProfile.gender,
          portfolioUrl: profile.candidateProfile.portfolioUrl,
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
      toast.success("Profile updated successfully!")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UpdateCandidateProfileRequest, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVerifyEmail = async () => {
    try {
      setEmailVerificationSent(true)
      // Call API to send verification email
      // await candidateService.sendVerificationEmail()
      toast.success("Verification email sent! Please check your inbox.")
      setTimeout(() => setEmailVerificationSent(false), 5000)
    } catch (err) {
      toast.error("Failed to send verification email")
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      // Implement image upload logic here
      // const formData = new FormData()
      // formData.append('image', file)
      // const response = await api.post('/upload/profile-image', formData)
      // handleInputChange('profileImage', response.data.url)
      toast.success("Profile image updated successfully!")
    } catch (err) {
      toast.error("Failed to upload image")
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <Button onClick={fetchProfile}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <CandidateSidebar 
        user={{
          fullName: profile.user.fullName,
          email: profile.user.email,
          profileImage: profile.user.profileImage
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-500">Manage your profile and preferences</p>
          </div>
          
          <div className="flex items-center gap-3">
            {error && (
              <div className="px-3 py-2 bg-red-50 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{profile.user.fullName}</p>
              <p className="text-xs text-gray-500">{profile.user.email}</p>
            </div>
            <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
              <AvatarImage src={profile.user.profileImage || "/professional-dark-haired-man.png"} />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {profile.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
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

          {/* Render Active Tab */}
          {activeTab === "Personal Info" && (
            <PersonalInfoForm 
              profile={profile} 
              isEditing={isEditing} 
              editData={editData}
              onInputChange={handleInputChange}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
              onVerifyEmail={handleVerifyEmail}
              emailVerificationSent={emailVerificationSent}
              onImageUpload={handleImageUpload}
              loading={loading}
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