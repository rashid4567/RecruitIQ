import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Briefcase, Users, User, Shield, Bell, CreditCard, 
  LogOut, Menu, X 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";
import { authService } from "@/services/auth/auth.service";
import { toast } from "sonner";

interface SidebarProps {
  profile: RecruiterProfile | null;
  userStats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    interviewsScheduled: number;
    profileCompletion: number;
  };
}

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/recruiter/" },
  { icon: Briefcase, label: "My Jobs", path: "/recruiter/jobs" },
  { icon: Users, label: "Candidates", path: "/recruiter/candidates" },
  { icon: User, label: "Profile", path: "/recruiter/settings?tab=profile" },
  { icon: Shield, label: "Security", path: "/recruiter/settings?tab=security" },
  { icon: Bell, label: "Notifications", path: "/recruiter/settings?tab=notifications" },
  { icon: CreditCard, label: "Billing", path: "/recruiter/settings?tab=billing" },
];

export function Sidebar({ profile, userStats }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();


  const currentPath = location.pathname + location.search;

  const completionColor = 
    userStats.profileCompletion > 80 ? "text-emerald-600" :
    userStats.profileCompletion > 60 ? "text-amber-600" : "text-red-600";


  const handleLogout = async () => {
    try {
      await authService.logout(false); 
      toast.success("Logged out successfully");
      
  
      const role = localStorage.getItem("userRole");
      if (role === "admin") {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/signin";
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.log(error);
      
    }
  };

  return (
    <>
   
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-lg border border-slate-200"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </div>


      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 
        shadow-2xl lg:shadow-none transition-all duration-300 z-50 flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        <div className="flex flex-col h-full">
          
    
          <div className="px-6 py-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-white font-bold text-3xl tracking-[-2px]">r</span>
              </div>
              <div>
                <span className="font-bold text-3xl tracking-tighter text-slate-900">Recruit</span>
                <span className="font-bold text-3xl tracking-tighter text-violet-600">IQ</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-1">Talent Intelligence Platform</p>
          </div>

          {/* Profile Section */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                <AvatarImage src={""} />
                <AvatarFallback className="bg-violet-100 text-violet-700 font-semibold text-xl">
                  {profile?.companyName?.slice(0, 2).toUpperCase() || "RI"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">
                  {profile?.companyName || "Your Company"}
                </p>
                <p className="text-sm text-slate-500 truncate">{profile?.email}</p>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-2 font-medium">
                <span className="text-slate-500">Profile Strength</span>
                <span className={`font-semibold ${completionColor}`}>
                  {userStats.profileCompletion}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-700"
                  style={{ width: `${userStats.profileCompletion}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-slate-900">{userStats.activeJobs}</p>
                <p className="text-xs text-slate-500 mt-1">Active Jobs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{userStats.totalApplications}</p>
                <p className="text-xs text-slate-500 mt-1">Applications</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath.includes(item.path.split("?")[0]);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all
                    ${isActive 
                      ? "bg-violet-50 text-violet-700 shadow-sm font-semibold" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-violet-600" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="p-6 border-t border-slate-100 mt-auto">
            <Separator className="mb-4" />
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-6 rounded-2xl text-base"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>

            <p className="text-center text-xs text-slate-400 mt-8">
              © 2026 RecruitIQ
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}