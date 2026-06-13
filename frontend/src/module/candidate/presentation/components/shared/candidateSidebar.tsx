import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Building2,
  User,
  Briefcase,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/module/auth/presentation/hooks/useLogout";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

interface CandidateSidebarProps {
  user?: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
  sidebarItems?: SidebarItem[];
}

export default function CandidateSidebar({
  user,
  sidebarItems = defaultSidebarItems,
}: CandidateSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading } = useLogout();

  const initials =
    user?.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const activeHrefMatches: Record<string, (pathname: string) => boolean> = {
    "/candidate/home": (p) => p === "/candidate/home",
    "/candidate/profile/setting": (p) =>
      p.startsWith("/candidate/profile/setting"),
    "/candidate/applications": (p) => p.startsWith("/candidate/applications"),
    "/candidate/jobs": (p) => p.startsWith("/candidate/jobs"),
    "/candidate/interviews": (p) => p.startsWith("/candidate/interviews"),
  };

  const isActive = (href: string) => {
    const matcher = activeHrefMatches[href];
    return matcher ? matcher(location.pathname) : location.pathname === href;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  return (
    <aside className="w-65 h-screen flex flex-col bg-white border-r border-slate-100">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <span className="text-[17px] font-bold tracking-tight text-slate-800">
          Recruit<span className="text-blue-600">IQ</span>
        </span>
      </div>

      {user && (
        <div className="mx-3 mb-5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100">
            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white shadow-sm">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {user.email}
              </p>
            </div>
            <div className="shrink-0 h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      <p className="px-5 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
        Menu
      </p>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {sidebarItems.map((item) => {
          const routeExists = defaultSidebarItems.some(
            (s) => s.href === item.href,
          );
          const active = isActive(item.href);

          return (
            <button
              key={item.label}
              onClick={() => {
                if (routeExists) navigate(item.href);
              }}
              disabled={!routeExists}
              title={!routeExists ? "Coming soon" : undefined}
              className={`
                group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all duration-150 relative
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : routeExists
                      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      : "text-slate-400 cursor-not-allowed opacity-60"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blue-300" />
              )}

              <span
                className={`
                  h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                  ${
                    active
                      ? "bg-white/20"
                      : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm"
                  }
                `}
              >
                <item.icon
                  className={`h-4 w-4 ${active ? "text-white" : "text-slate-500 group-hover:text-blue-600"}`}
                />
              </span>

              <span className="flex-1 text-left font-medium truncate">
                {item.label}
              </span>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {!routeExists && (
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-slate-100 pt-3 space-y-1">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 disabled:opacity-50 group"
        >
          <span className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
            <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500" />
          </span>
          <span>{isLoading ? "Logging out…" : "Log out"}</span>
        </button>

        <p className="text-[11px] text-slate-400 px-3 pt-1">
          Need help?{" "}
          <a
            href="mailto:support@recruitiq.com"
            className="text-blue-500 hover:underline"
          >
            support@recruitiq.com
          </a>
        </p>
      </div>
    </aside>
  );
}

const defaultSidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/candidate/home",
  },
  {
    icon: Building2,
    label: "My Applications",
    href: "/candidate/applications",
  },
  {
    icon: User,
    label: "My Profile",
    href: "/candidate/profile/setting",
  },
  {
    icon: Briefcase,
    label: "Browse Jobs",
    href: "/candidate/jobs",
  },
  {
    icon: MessageSquare,
    label: "Interviews",
    href: "/candidate/interviews",
  },
];
