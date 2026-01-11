import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  Briefcase,
  MessageSquare,
  FileText,
  Upload,
  Linkedin,
  Globe,
  MapPin,
  CheckCircle2,
  Mail,
  Phone,
  Users,
  Shield,
  Bell,
  Lock,
  Save,
  Loader2,
  AlertCircle,
  CreditCard,
  Download,
  Settings,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Edit,
  Plus,
  BellRing,
  Check,
} from "lucide-react"
import { recruiterService } from "../../services/recruiter/recruiter.service"
import type { RecruiterProfileData, RecruiterProfileResponse } from "../../types/recruiter/recruiter.profile.type"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/recruiter/dashboard", badge: null },
  { icon: Briefcase, label: "Job Posts", href: "/recruiter/jobs", badge: "3" },
  { icon: Building2, label: "Company", href: "#", badge: null },
  { icon: Sparkles, label: "My Profile", href: "/recruiter/settings", active: true, badge: null },
  { icon: MessageSquare, label: "Messages", href: "#", badge: "12" },
  { icon: FileText, label: "Applications", href: "#", badge: "24" },
]

export default function RecruiterSettingsPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [profile, setProfile] = useState<RecruiterProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<RecruiterProfileData>({})
  const [userStats, setUserStats] = useState({
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
      setSaving(true)
      const updatedProfile = await recruiterService.updateProfile(formData)
      setProfile(updatedProfile)
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved",
        action: {
          label: "View",
          onClick: () => console.log("View profile"),
        },
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile", {
        description: "Please try again later",
      })
    } finally {
      setSaving(false)
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
      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-9 w-9 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-linear-to-r from-blue-400/30 to-blue-600/30 rounded-2xl blur-lg" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-linear-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">
                    RecruitIQ
                  </span>
                  <p className="text-xs text-slate-500">Recruiter Portal</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">{userStats.activeJobs} Active Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-slate-700">{userStats.totalApplications} Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-slate-700">{userStats.interviewsScheduled} Interviews</span>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full" />
              </Button>
              
              <div className="flex items-center gap-3 p-2 rounded-xl bg-linear-to-r from-blue-50/50 to-blue-100/30 border border-blue-200/50">
                <Avatar className="h-9 w-9 border-2 border-white shadow-md">
                  <AvatarImage src="/professional-dark-haired-man.png" />
                  <AvatarFallback className="bg-linear-to-br from-blue-600 to-blue-700 text-white font-medium">
                    LB
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-900">Liam Basil</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white border-0 text-[10px] px-2 py-0.5 h-5">
                      Recruiter
                    </Badge>
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-500">{profile?.companyName || "Company"}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-linear-to-br from-white to-blue-50/50 border-blue-200/50 shadow-lg shadow-blue-500/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/5 to-blue-600/5 rounded-full -translate-y-16 translate-x-16" />
              <CardContent className="pt-6 relative">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                      <AvatarImage src="/professional-dark-haired-man.png" />
                      <AvatarFallback className="bg-linear-to-br from-blue-600 to-blue-700 text-white text-xl font-bold">
                        LB
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Liam Basil</h3>
                  <p className="text-sm text-slate-600">{profile?.designation || "Senior Recruiter"}</p>
                  <Badge className="mt-2 bg-linear-to-r from-blue-500 to-blue-600 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Verified Recruiter
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Profile Completion</span>
                      <span className="text-sm font-bold text-blue-600">{userStats.profileCompletion}%</span>
                    </div>
                    <Progress value={userStats.profileCompletion} className="h-2 bg-slate-100" />
                  </div>

                  <Separator className="bg-slate-200/50" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-linear-to-br from-blue-50 to-blue-100/30 border border-blue-200/50">
                      <p className="text-2xl font-bold text-blue-600">{userStats.totalJobs}</p>
                      <p className="text-xs text-blue-800">Total Jobs</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-linear-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200/50">
                      <p className="text-2xl font-bold text-emerald-600">{userStats.activeJobs}</p>
                      <p className="text-xs text-emerald-800">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="border-slate-200/50 shadow-sm">
              <CardContent className="p-3">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                        item.active
                          ? "bg-linear-to-r from-blue-50 to-blue-100/50 text-blue-600 border-r-2 border-blue-500"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          item.active 
                            ? "bg-blue-500/10 text-blue-600" 
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                        }`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            {profile && (
              <Card className="bg-linear-to-br from-blue-900 to-blue-950 border-0 shadow-xl shadow-blue-500/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-full -translate-y-8 translate-x-8" />
                <CardContent className="pt-6 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Free Plan</h4>
                      <p className="text-blue-300 text-sm">Basic features</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-blue-200 text-sm">Up to 5 job posts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-blue-200 text-sm">Basic analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-blue-200 text-sm">Email support</span>
                    </div>
                  </div>

                  <Button className="w-full bg-white text-blue-900 hover:bg-blue-50 font-medium shadow-lg">
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Account Settings
                </h1>
                <p className="text-slate-500">Manage your company profile and preferences</p>
              </div>
              
              {profile && (
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Status</p>
                      <Badge className={
                        profile.verificationStatus === "verified"
                          ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0"
                          : "bg-linear-to-r from-amber-500 to-amber-600 text-white border-0"
                      }>
                        {profile.verificationStatus === "verified" ? (
                          <ShieldCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)}
                      </Badge>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Job Posts Used</p>
                      <p className="text-lg font-bold text-blue-600">{profile.jobPostsUsed}/5</p>
                    </div>
                  </div>
                  <Button className="gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25">
                    <Plus className="h-4 w-4" />
                    New Job Post
                  </Button>
                </div>
              )}
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 lg:grid-cols-5 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                <TabsTrigger value="company" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
                  <Building2 className="h-4 w-4 mr-2" />
                  Company
                </TabsTrigger>
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
                <TabsContent value="company">
                  <CompanyInfoForm 
                    formData={formData} 
                    onChange={handleInputChange} 
                    onSave={handleSave} 
                    saving={saving}
                    profile={profile}
                  />
                </TabsContent>

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

// Rest of the component functions remain the same but with premium styling...
// [CompanyInfoForm, ProfileSection, SecuritySection, NotificationsSection, BillingSection]
// They need to be updated with the same premium styling approach

function CompanyInfoForm({ formData, onChange, onSave, saving, profile }: any) {
  const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Marketing",
    "Real Estate",
    "Other"
  ]

  return (
    <div className="space-y-8">
      {/* Company Overview Card */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Company Information</CardTitle>
              <CardDescription>Update your company details and branding</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="companyName" className="text-sm font-medium text-slate-700">
                Company Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName || ""}
                onChange={(e) => onChange("companyName", e.target.value)}
                placeholder="Enter company name"
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="companyWebsite" className="text-sm font-medium text-slate-700">
                Company Website
              </Label>
              <div className="relative">
                <Input
                  id="companyWebsite"
                  value={formData.companyWebsite || ""}
                  onChange={(e) => onChange("companyWebsite", e.target.value)}
                  placeholder="https://example.com"
                  className="h-12 pl-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="companySize" className="text-sm font-medium text-slate-700">
                Company Size
              </Label>
              <Select value={formData.companySize} onValueChange={(value) => onChange("companySize", value)}>
                <SelectTrigger className="h-12 border-slate-200">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size} className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      {size} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="industry" className="text-sm font-medium text-slate-700">
                Industry
              </Label>
              <Select value={formData.industry} onValueChange={(value) => onChange("industry", value)}>
                <SelectTrigger className="h-12 border-slate-200">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="location" className="text-sm font-medium text-slate-700">
              Company Location
            </Label>
            <div className="relative">
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="Enter company location"
                className="h-12 pl-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="designation" className="text-sm font-medium text-slate-700">
              Your Designation
            </Label>
            <Input
              id="designation"
              value={formData.designation || ""}
              onChange={(e) => onChange("designation", e.target.value)}
              placeholder="e.g., Senior Recruiter, HR Manager"
              className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="bio" className="text-sm font-medium text-slate-700">
              Company Bio / About
            </Label>
            <Textarea
              id="bio"
              value={formData.bio || ""}
              onChange={(e) => onChange("bio", e.target.value)}
              placeholder="Tell candidates about your company culture, mission, and values..."
              className="min-h-35 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              rows={5}
            />
            <p className="text-xs text-slate-500">
              This will be visible to candidates on your company profile page. (Max 500 characters)
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            className="h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="h-11 px-6 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 gap-2"
          >
            {saving ? (
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
        </CardFooter>
      </Card>

      {/* Stats Overview */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-linear-to-br from-blue-50 to-blue-100/30 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Job Posts Used</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{profile.jobPostsUsed}/5</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={(profile.jobPostsUsed / 5) * 100} className="h-2 bg-blue-200 mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-emerald-50 to-emerald-100/30 border-emerald-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-900">Verification Status</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2 capitalize">
                    {profile.verificationStatus}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4">
                <Badge className={
                  profile.verificationStatus === "verified"
                    ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0"
                    : "bg-linear-to-r from-amber-500 to-amber-600 text-white border-0"
                }>
                  {profile.verificationStatus === "verified" ? "Verified" : "In Review"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-amber-50 to-amber-100/30 border-amber-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900">Member Since</p>
                  <p className="text-2xl font-bold text-amber-600 mt-2">
                    {new Date(profile.createdAt).getFullYear()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-amber-800 mt-4">
                {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-violet-50 to-violet-100/30 border-violet-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-900">Subscription</p>
                  <p className="text-2xl font-bold text-violet-600 mt-2 capitalize">
                    {profile.subscriptionStatus}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 border-violet-200 text-violet-700 hover:bg-violet-50">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function ProfileSection() {
  return (
    <Card className="border-slate-200/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-900">Personal Profile</CardTitle>
            <CardDescription>Update your personal information and contact details</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
              <AvatarImage src="/professional-dark-haired-man.png" />
              <AvatarFallback className="bg-linear-to-br from-blue-600 to-blue-700 text-white text-2xl font-bold">
                LB
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Profile Photo</h4>
            <p className="text-sm text-slate-600">
              Upload a professional photo. Recommended size: 400x400px. Max 5MB.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 border-slate-200">
                <Upload className="h-4 w-4" />
                Upload New
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Personal Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                defaultValue="Liam Basil"
                className="h-12 pl-11 border-slate-200"
                disabled
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500">Contact support to change your name</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                defaultValue="liam.basil@example.com"
                className="h-12 pl-11 pr-32 border-slate-200"
                disabled
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Mail className="h-4 w-4 text-slate-600" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-500 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                defaultValue="+1 (415) 209-6798"
                className="h-12 pl-11 border-slate-200"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-sm font-medium text-slate-700">
              LinkedIn Profile
            </Label>
            <div className="relative">
              <Input
                id="linkedin"
                defaultValue="https://linkedin.com/in/liambasil"
                className="h-12 pl-11 border-slate-200"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <Button variant="outline" className="h-11 px-6 border-slate-200">
          Cancel
        </Button>
        <Button className="h-11 px-6 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25">
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  )
}

function SecuritySection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: "MacBook Pro", location: "San Francisco, CA", time: "Current", current: true },
    { id: 2, device: "iPhone 14", location: "San Francisco, CA", time: "2 hours ago" },
    { id: 3, device: "Windows PC", location: "New York, NY", time: "3 days ago" },
  ])

  return (
    <div className="space-y-8">
      {/* Password Security Card */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-500 to-rose-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Password & Security</CardTitle>
              <CardDescription>Manage your password and account security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Change Password */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500">Update your password to keep your account secure</p>
              </div>
              <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Strong
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="h-12 pl-11 pr-11 border-slate-200"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-slate-600" />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="h-12 pl-11 pr-11 border-slate-200"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-slate-600" />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="h-12 pl-11 pr-11 border-slate-200"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-slate-600" />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-end">
                <Button className="h-12 w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25">
                  Update Password
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-linear-to-r from-blue-50 to-blue-100/30 border border-blue-200/50">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-900">Password Requirements</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-500" />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-500" />
                      Include uppercase and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-500" />
                      Include at least one number
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-200/50" />

          {/* Two-Factor Authentication */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <div className={`p-6 rounded-xl border transition-all duration-300 ${
              twoFactorEnabled 
                ? "bg-linear-to-r from-emerald-50 to-emerald-100/30 border-emerald-200/50" 
                : "bg-linear-to-r from-slate-50 to-slate-100/30 border-slate-200/50"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  twoFactorEnabled 
                    ? "bg-linear-to-br from-emerald-500 to-emerald-600" 
                    : "bg-linear-to-br from-slate-500 to-slate-600"
                }`}>
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">2FA is {twoFactorEnabled ? "enabled" : "disabled"}</h4>
                    {twoFactorEnabled && (
                      <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    {twoFactorEnabled 
                      ? "Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in."
                      : "Enable two-factor authentication for enhanced security. You'll need to enter a code from your authenticator app when signing in."
                    }
                  </p>
                  <div className="flex gap-3">
                    {twoFactorEnabled ? (
                      <>
                        <Button variant="outline" className="border-slate-200">
                          Backup Codes
                        </Button>
                        <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                          Disable 2FA
                        </Button>
                      </>
                    ) : (
                      <Button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25">
                        Enable 2FA
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Active Sessions</CardTitle>
              <CardDescription>Manage your active login sessions across devices</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                session.current
                  ? "bg-linear-to-r from-blue-50 to-blue-100/30 border-blue-200/50"
                  : "bg-slate-50/50 border-slate-200/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  session.current
                    ? "bg-linear-to-br from-blue-500 to-blue-600"
                    : "bg-linear-to-br from-slate-500 to-slate-600"
                }`}>
                  {session.device.includes("Mac") || session.device.includes("iPhone") ? (
                    <Apple className="h-5 w-5 text-white" />
                  ) : (
                    <Monitor className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-slate-900">{session.device}</h4>
                    {session.current && (
                      <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white border-0 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.time}
                    </span>
                  </div>
                </div>
              </div>
              
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              )}
            </div>
          ))}
        </CardContent>
        
        <CardFooter className="pt-6 border-t border-slate-200">
          <Button variant="outline" className="w-full border-slate-200">
            Sign out from all devices
          </Button>
        </CardFooter>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-500 to-rose-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-linear-to-r from-rose-50 to-rose-100/30 border border-rose-200/50">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-rose-900">Delete Account</h4>
                    <Badge className="bg-linear-to-r from-rose-500 to-rose-600 text-white border-0">
                      Dangerous
                    </Badge>
                  </div>
                  <p className="text-sm text-rose-700 mb-4">
                    Once you delete your account, there is no going back. This will permanently delete your account, 
                    company data, job posts, and all associated information. This action cannot be undone.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button variant="destructive" className="bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25">
                      Delete Account
                    </Button>
                    <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                      Export Data First
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-linear-to-r from-amber-50 to-amber-100/30 border border-amber-200/50">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">Export Your Data</h4>
                  <p className="text-sm text-amber-700 mb-4">
                    Download all your data including job posts, applications, and company information before deleting your account.
                  </p>
                  <Button variant="outline" className="border-amber-200 text-amber-600 hover:bg-amber-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationsSection() {
  const [emailSettings, setEmailSettings] = useState({
    newApplications: true,
    interviewUpdates: true,
    jobExpiryAlerts: false,
    weeklyDigest: true,
    marketingEmails: false,
  })

  const [pushSettings, setPushSettings] = useState({
    newApplications: true,
    messages: true,
    reminders: false,
  })

  return (
    <div className="space-y-8">
      {/* Email Notifications Card */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-violet-500 to-violet-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Email Notifications</CardTitle>
              <CardDescription>Control how and when you receive email notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'newApplications', label: 'New Applications', description: 'When candidates apply to your jobs' },
              { key: 'interviewUpdates', label: 'Interview Updates', description: 'Changes to scheduled interviews' },
              { key: 'jobExpiryAlerts', label: 'Job Expiry Alerts', description: 'When your job posts are about to expire' },
              { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your weekly activity and insights' },
              { key: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates, tips, and promotional offers' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 hover:border-slate-300/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      emailSettings[item.key as keyof typeof emailSettings]
                        ? "bg-linear-to-br from-violet-500 to-violet-600"
                        : "bg-slate-100"
                    }`}>
                      {item.key === 'newApplications' && <Briefcase className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'interviewUpdates' && <Calendar className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'jobExpiryAlerts' && <AlertCircle className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'weeklyDigest' && <TrendingUp className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'marketingEmails' && <Sparkles className={`h-4 w-4 ${emailSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={emailSettings[item.key as keyof typeof emailSettings]}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, [item.key]: checked }))
                  }
                  className="data-[state=checked]:bg-violet-500"
                />
              </div>
            ))}
          </div>

          <Separator className="bg-slate-200/50" />

          <div className="p-4 rounded-xl bg-linear-to-r from-violet-50 to-violet-100/30 border border-violet-200/50">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-violet-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-violet-900">Notification Frequency</h4>
                <p className="text-sm text-violet-800">
                  You can choose to receive notifications instantly, daily, or weekly.
                </p>
                <div className="flex gap-3 mt-3">
                  <Button variant="outline" size="sm" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                    Instant
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200">
                    Daily Digest
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200">
                    Weekly Digest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button variant="outline" className="border-slate-200">
            Reset to Defaults
          </Button>
          <Button className="bg-linear-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg shadow-violet-500/25">
            Save Preferences
          </Button>
        </CardFooter>
      </Card>

      {/* Push Notifications Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <BellRing className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Push Notifications</CardTitle>
              <CardDescription>Control browser and mobile push notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'newApplications', label: 'New Applications', description: 'Real-time alerts for new job applications' },
              { key: 'messages', label: 'Messages', description: 'When candidates or team members message you' },
              { key: 'reminders', label: 'Reminders', description: 'Interview and task reminders' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 hover:border-slate-300/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      pushSettings[item.key as keyof typeof pushSettings]
                        ? "bg-linear-to-br from-blue-500 to-blue-600"
                        : "bg-slate-100"
                    }`}>
                      {item.key === 'newApplications' && <Briefcase className={`h-4 w-4 ${pushSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'messages' && <MessageSquare className={`h-4 w-4 ${pushSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                      {item.key === 'reminders' && <Bell className={`h-4 w-4 ${pushSettings[item.key] ? 'text-white' : 'text-slate-500'}`} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={pushSettings[item.key as keyof typeof pushSettings]}
                  onCheckedChange={(checked) => 
                    setPushSettings(prev => ({ ...prev, [item.key]: checked }))
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-linear-to-r from-blue-50 to-blue-100/30 border border-blue-200/50">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">Browser Permissions</h4>
                <p className="text-sm text-blue-800 mb-4">
                  You need to allow browser notifications to receive push notifications. Click the button below to enable.
                </p>
                <div className="flex items-center gap-4">
                  <Button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25">
                    Enable Push Notifications
                  </Button>
                  <div className="text-xs text-slate-500">
                    <Check className="h-3 w-3 inline mr-1 text-emerald-500" />
                    Currently {pushSettings.newApplications ? "enabled" : "disabled"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-6 border-t border-slate-200">
          <div className="w-full">
            <h4 className="font-medium text-slate-900 mb-4">Notification Sound</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-3" />
                Default
              </Button>
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-3" />
                Gentle
              </Button>
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-3" />
                Alert
              </Button>
              <Button variant="outline" className="justify-start border-slate-200">
                <div className="h-3 w-3 rounded-full bg-violet-500 mr-3" />
                None
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function BillingSection({ profile }: { profile?: RecruiterProfileResponse | null }) {
  const [billingHistory, setBillingHistory] = useState([
    { id: 1, date: "Jan 15, 2024", plan: "Free Plan", amount: "$0.00", status: "paid" },
    { id: 2, date: "Dec 15, 2023", plan: "Free Plan", amount: "$0.00", status: "paid" },
    { id: 3, date: "Nov 15, 2023", plan: "Free Plan", amount: "$0.00", status: "paid" },
  ])

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Up to 5 job posts",
        "Basic analytics dashboard",
        "Email support",
        "100 applications/month",
        "Standard templates",
      ],
      current: profile?.subscriptionStatus === "free",
      linear: "from-blue-500 to-blue-600",
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "For growing teams",
      features: [
        "Unlimited job posts",
        "Advanced analytics",
        "Priority support",
        "Unlimited applications",
        "AI-powered matching",
        "Custom branding",
        "Team collaboration",
      ],
      popular: true,
      current: profile?.subscriptionStatus === "active",
      linear: "from-emerald-500 to-emerald-600",
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "Custom workflows",
        "Onboarding support",
      ],
      current: false,
      linear: "from-violet-500 to-violet-600",
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Plans Comparison Card */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-emerald-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Plans & Pricing</CardTitle>
              <CardDescription>Choose the perfect plan for your hiring needs</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] ${
                  plan.current
                    ? "border-blue-300 bg-linear-to-br from-blue-50 to-blue-100/30"
                    : plan.popular
                    ? "border-emerald-300 bg-linear-to-br from-emerald-50 to-emerald-100/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/25 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        plan.current
                          ? "bg-linear-to-br from-blue-500 to-blue-600"
                          : plan.popular
                          ? "bg-linear-to-br from-emerald-500 to-emerald-600"
                          : "bg-slate-200"
                      }`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full h-12 ${
                    plan.popular
                      ? "bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                      : plan.current
                      ? "border-blue-300 text-blue-600 hover:bg-blue-50"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-xl bg-linear-to-r from-slate-50 to-slate-100/30 border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Need a custom plan?</h4>
                <p className="text-sm text-slate-600">
                  Contact our sales team for enterprise solutions with custom features.
                </p>
              </div>
              <Button variant="outline" className="border-slate-200">
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Usage Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Current Usage</CardTitle>
              <CardDescription>Your current plan usage and limits</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Job Posts</span>
                  <span className="text-sm font-bold text-blue-600">{profile?.jobPostsUsed || 0}/5</span>
                </div>
                <Progress value={((profile?.jobPostsUsed || 0) / 5) * 100} className="h-2" />
              </div>
              <div className="text-sm text-slate-600">
                {5 - (profile?.jobPostsUsed || 0)} posts remaining
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Applications</span>
                  <span className="text-sm font-bold text-emerald-600">24/100</span>
                </div>
                <Progress value={24} className="h-2 bg-emerald-100" />
              </div>
              <div className="text-sm text-slate-600">
                76 applications remaining this month
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Team Members</span>
                  <span className="text-sm font-bold text-amber-600">1/1</span>
                </div>
                <Progress value={100} className="h-2 bg-amber-100" />
              </div>
              <div className="text-sm text-slate-600">
                Upgrade to add more team members
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Storage</span>
                  <span className="text-sm font-bold text-violet-600">0.5/5 GB</span>
                </div>
                <Progress value={10} className="h-2 bg-violet-100" />
              </div>
              <div className="text-sm text-slate-600">
                4.5 GB storage available
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-6 border-t border-slate-200">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Billing Cycle</h4>
                <p className="text-sm text-slate-500">Next billing date: Feb 15, 2024</p>
              </div>
              <Button variant="outline" className="border-slate-200">
                Change Billing Date
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Billing History Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-xl border border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50/50 border-b border-slate-200/50">
              <div className="text-sm font-medium text-slate-700">Date</div>
              <div className="text-sm font-medium text-slate-700">Plan</div>
              <div className="text-sm font-medium text-slate-700">Amount</div>
              <div className="text-sm font-medium text-slate-700">Status</div>
            </div>
            
            <div className="divide-y divide-slate-200/50">
              {billingHistory.map((invoice) => (
                <div key={invoice.id} className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50/30 transition-colors">
                  <div className="text-sm text-slate-900">{invoice.date}</div>
                  <div className="text-sm text-slate-700">{invoice.plan}</div>
                  <div className="text-sm font-medium text-slate-900">{invoice.amount}</div>
                  <div>
                    <Badge className={
                      invoice.status === "paid"
                        ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0"
                        : "bg-linear-to-r from-amber-500 to-amber-600 text-white border-0"
                    }>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-6 rounded-xl bg-linear-to-r from-blue-50 to-blue-100/30 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-900">Payment Method</h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Visa ending in 4242</p>
                    <p className="text-xs text-blue-700">Expires 12/25</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-200">
                  Update Card
                </Button>
                <Button variant="outline" className="border-slate-200">
                  <Download className="h-4 w-4 mr-2" />
                  All Invoices
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-6 border-t border-slate-200">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Need help with billing?</h4>
                <p className="text-sm text-slate-500">Contact our support team for billing questions</p>
              </div>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Contact Support
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

import {
  Apple,
  Monitor,
  Clock,
} from "lucide-react"