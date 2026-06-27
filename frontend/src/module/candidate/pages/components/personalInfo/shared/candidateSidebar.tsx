import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Building2,
  User,
  Briefcase,
  MessageSquare,
  Search,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/module/auth/hooks/useLogout";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string | number;
}

interface CandidateSidebarProps {
  user?: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
  sidebarItems?: SidebarItem[];
}

const defaultSidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/candidate/home" },
  { icon: Building2,       label: "My Applications",  href: "/candidate/applications",},
  { icon: Search,          label: "Browse Jobs",       href: "/candidate/jobs" },
  { icon: User,            label: "My Profile",        href: "/candidate/profile/setting" },
  { icon: MessageSquare,   label: "Interviews",        href: "/candidate/interviews" },

];

const activeMatchers: Record<string, (p: string) => boolean> = {
  "/candidate/home":             (p) => p === "/candidate/home",
  "/candidate/applications":     (p) => p.startsWith("/candidate/applications"),
  "/candidate/jobs":             (p) => p.startsWith("/candidate/jobs"),
  "/candidate/profile/setting":  (p) => p.startsWith("/candidate/profile/setting"),
  "/candidate/interviews":       (p) => p.startsWith("/candidate/interviews"),
};

export default function CandidateSidebar({
  user,
  sidebarItems = defaultSidebarItems,
}: CandidateSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading } = useLogout();

  const initials = (user?.fullName ?? "")
  .split(" ")
  .filter(Boolean)
  .map((name) => name[0])
  .join("")
  .toUpperCase()
  .slice(0, 2) || "U";

  const isActive = (href: string) => {
    if (!href) return false;
    const matcher = activeMatchers[href];
    return matcher ? matcher(location.pathname) : location.pathname === href;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <aside className="w-60 h-screen flex flex-col bg-white border-r border-slate-100">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4.5 border-b border-slate-100">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-medium tracking-tight text-slate-900">
          Recruit<span className="text-blue-600">IQ</span>
        </span>
      </div>

    
      {user && (
        <div className="mx-2.5 mt-3 mb-1">
          <button
            onClick={() => navigate("/candidate/profile/setting")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <Avatar className="h-8.5 w-8.5 shrink-0">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-slate-800 truncate leading-tight">
                {user.fullName}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>
        </div>
      )}

      <p className="px-4.5 pt-4 pb-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
        Menu
      </p>

   
      <nav className="flex-1 px-2 space-y-px overflow-y-auto">
        {sidebarItems.map((item) => {
          const enabled = !!item.href;
          const active = isActive(item.href);

          return (
            <button
              key={item.label}
              onClick={() => enabled && navigate(item.href)}
              disabled={!enabled}
              title={!enabled ? "Coming soon" : undefined}
              className={`
                group relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                text-sm transition-colors duration-100
                ${active
                  ? "bg-blue-50"
                  : enabled
                    ? "hover:bg-slate-50"
                    : "opacity-45 cursor-not-allowed"
                }
              `}
            >

              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-4.5 rounded-r-full bg-blue-600" />
              )}

              <span className={`
                h-7.5 w-7.5 rounded-[7px] flex items-center justify-center shrink-0 transition-colors
                ${active
                  ? "bg-blue-600"
                  : "bg-slate-100 group-hover:bg-white group-hover:border group-hover:border-slate-200"
                }
              `}>
                <item.icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-800"}`} />
              </span>

              <span className={`
                flex-1 text-left font-normal
                ${active ? "text-blue-600 font-medium" : "text-slate-500 group-hover:text-slate-900"}
              `}>
                {item.label}
              </span>

              {item.badge && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                  {item.badge}
                </span>
              )}

           
              {!enabled && (
                <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

 
      <div className="border-t border-slate-100 p-2">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          <span className="h-7.5 w-7.5 rounded-[7px] bg-slate-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
            <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500" />
          </span>
          <span className="text-slate-500 group-hover:text-red-600 transition-colors">
            {isLoading ? "Logging out…" : "Log out"}
          </span>
        </button>
      </div>
    </aside>
  );
}