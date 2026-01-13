import { useState, useEffect } from "react"
import { recruiterService } from "../../services/recruiter/recruiter.service"
import type { RecruiterProfileData, RecruiterProfileResponse } from "../../types/recruiter/recruiter.profile.type"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, User, Shield, Bell, CreditCard } from "lucide-react"
import  RecruiterHeader  from "../../components/recruiter/header"
import { Sidebar } from "../../components/sidebar/recruiterSidebar"
// import { CompanyInfoForm } from "./profileSeting/CompanyInfoForm"
import { ProfileSection } from "./profileSeting/ProfileSection"
import { SecuritySection } from "./profileSeting/SecuritySection"
import { NotificationsSection } from "./profileSeting/NotificationsSection"
import { BillingSection } from "./profileSeting/BillingSection"

export default function RecruiterSettingsPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [profile, setProfile] = useState<RecruiterProfileResponse | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<RecruiterProfileData>({})
  const [userStats] = useState({
    totalJobs: 3,
    activeJobs: 2,
    totalApplications: 24,
    interviewsScheduled: 8,
    profileCompletion: 85,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await recruiterService.getProfile()
      setProfile(data)
      setFormData({
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
        companySize: data.companySize,
        industry: data.industry,
        location: data.location,
        bio: data.bio,
        designation: data.designation,
      })
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof RecruiterProfileData, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      const updatedProfile = await recruiterService.updateProfile(formData)
      setProfile(updatedProfile)
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 animate-pulse">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -inset-4 bg-linear-to-r from-blue-400/20 to-blue-600/20 rounded-3xl blur-xl" />
          </div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      <RecruiterHeader  />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar profile={profile} userStats={userStats} activePath="/recruiter/settings" />
          
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Account Settings
                </h1>
                <p className="text-slate-500">Manage your company profile and preferences</p>
              </div>
              
 
            </div>

      
            <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 lg:grid-cols-5 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
               
                <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="billing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
              

                <TabsContent value="profile">
                  <ProfileSection />
                </TabsContent>

                <TabsContent value="security">
                  <SecuritySection />
                </TabsContent>

                <TabsContent value="notifications">
                  <NotificationsSection />
                </TabsContent>

                <TabsContent value="billing">
                  <BillingSection profile={profile} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}