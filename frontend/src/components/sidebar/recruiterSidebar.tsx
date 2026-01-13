import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Crown, 
  Check, 
  Briefcase, 
  Building2, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  LayoutDashboard,
  Users,
  Calendar,
  TrendingUp,
  CreditCard,
  Settings,
  Bell,
  Shield,
  LogOut,
  HelpCircle,
  Globe,
  Star
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface SidebarItem {
  icon: any
  label: string
  path: string
  badge?: string | null
  active?: boolean
}

interface SidebarProps {
  profile?: any
  userStats?: any
  activePath?: string
  onLogout?: () => void
  onNavigate?: (path: string) => void
}

export function Sidebar({ 
  profile, 
  userStats, 
  activePath = "/dashboard",
  onLogout,
  onNavigate 
}: SidebarProps) {
  const navigate = useNavigate()
  
  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/recruiter/dashboard", badge: null },
    { icon: Briefcase, label: "Job Posts", path: "/recruiter/jobs", badge: "3" },
    { icon: Building2, label: "Company", path: "/recruiter/settings", badge: null },
    { icon: Sparkles, label: "My Profile", path: "/recruiter/profile", badge: null },
    { icon: MessageSquare, label: "Messages", path: "/recruiter/messages", badge: "12" },
    { icon: FileText, label: "Applications", path: "/recruiter/applications", badge: "24" },
    { icon: Users, label: "Candidates", path: "/recruiter/candidates", badge: null },
    { icon: Calendar, label: "Calendar", path: "/recruiter/calendar", badge: "5" },
    { icon: TrendingUp, label: "Analytics", path: "/recruiter/analytics", badge: null },
  ]

  const settingsItems: SidebarItem[] = [
    { icon: Settings, label: "Settings", path: "/recruiter/settings", badge: null },
    { icon: Bell, label: "Notifications", path: "/recruiter/notifications", badge: "3" },
    { icon: Shield, label: "Security", path: "/recruiter/security", badge: null },
    { icon: CreditCard, label: "Billing", path: "/recruiter/billing", badge: null },
    { icon: HelpCircle, label: "Help & Support", path: "/recruiter/help", badge: null },
  ]

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      navigate(path)
    }
  }

  return (
    <div className="h-full w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
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
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Profile Card */}
        <Card className="bg-linear-to-br from-white to-blue-50/50 border-blue-200/50 shadow-lg shadow-blue-500/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/5 to-blue-600/5 rounded-full -translate-y-16 translate-x-16" />
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                  <AvatarImage src="/professional-dark-haired-man.png" />
                  <AvatarFallback className="bg-linear-to-br from-blue-600 to-blue-700 text-white text-lg font-bold">
                    LB
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900">Liam Basil</h3>
              <p className="text-xs text-slate-600">{profile?.designation || "Senior Recruiter"}</p>
              <Badge className="mt-1.5 bg-linear-to-r from-blue-500 to-blue-600 text-white border-0 text-[10px] px-2 py-0.5">
                <Crown className="h-2.5 w-2.5 mr-1" />
                Verified Recruiter
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700">Profile Completion</span>
                  <span className="text-xs font-bold text-blue-600">{userStats?.profileCompletion || 85}%</span>
                </div>
                <Progress value={userStats?.profileCompletion || 85} className="h-1.5 bg-slate-100" />
              </div>

              <Separator className="bg-slate-200/50" />

              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg bg-linear-to-br from-blue-50 to-blue-100/30 border border-blue-200/50">
                  <p className="text-lg font-bold text-blue-600">{userStats?.totalJobs || 3}</p>
                  <p className="text-[10px] text-blue-800">Total Jobs</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-linear-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200/50">
                  <p className="text-lg font-bold text-emerald-600">{userStats?.activeJobs || 2}</p>
                  <p className="text-[10px] text-emerald-800">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">MAIN</h3>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activePath === item.path
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-linear-to-r from-blue-50 to-blue-100/50 text-blue-600 border-l-2 border-blue-500"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      isActive 
                        ? "bg-blue-500/10 text-blue-600" 
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">SETTINGS</h3>
          <nav className="space-y-1">
            {settingsItems.map((item) => {
              const isActive = activePath === item.path
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-linear-to-r from-blue-50 to-blue-100/50 text-blue-600 border-l-2 border-blue-500"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      isActive 
                        ? "bg-blue-500/10 text-blue-600" 
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-linear-to-r from-rose-500 to-rose-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Subscription Card */}
        <Card className="bg-linear-to-br from-blue-900 to-blue-950 border-0 shadow-xl shadow-blue-500/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-full -translate-y-6 translate-x-6" />
          <CardContent className="pt-5 relative">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Free Plan</h4>
                <p className="text-blue-300 text-xs">Basic features</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-blue-200 text-xs">Up to 5 job posts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-blue-200 text-xs">Basic analytics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-blue-200 text-xs">Email support</span>
              </div>
            </div>

            <Button 
              onClick={() => handleNavigation("/recruiter/billing")}
              className="w-full bg-white text-blue-900 hover:bg-blue-50 font-medium text-sm py-1.5"
            >
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900 text-sm">Need help?</h4>
              <p className="text-xs text-slate-600 mt-0.5">Check our documentation or contact support</p>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs py-1 h-7 border-slate-200"
                  onClick={() => handleNavigation("/recruiter/help")}
                >
                  Documentation
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs py-1 h-7 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => handleNavigation("/recruiter/support")}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Logout */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/professional-dark-haired-man.png" />
              <AvatarFallback className="bg-linear-to-br from-blue-600 to-blue-700 text-white text-xs font-medium">
                LB
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-900">Liam Basil</p>
              <p className="text-xs text-slate-500">{profile?.companyName || "Tech Corp Inc"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}