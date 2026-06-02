import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Building2,
  User,
  Briefcase,
  MessageSquare,
  FileText,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { useLogout } from "@/module/auth/presentation/hooks/useLogout";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
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
      .toUpperCase() || "U";

  const isActive = (href: string) => {
    if (href === "/candidate/home" && location.pathname === "/candidate/home")
      return true;

    if (
      href === "/candidate/profile/setting" &&
      location.pathname.startsWith("/candidate/profile/setting")
    )
      return true;

    if (
      href === "/candidate/applications" &&
      location.pathname.startsWith("/candidate/applications")
    )
      return true;

    if (
      href === "/candidate/jobs" &&
      location.pathname.startsWith("/candidate/jobs")
    )
      return true;

    if (
      href === "/candidate/interviews" &&
      location.pathname.startsWith("/candidate/interviews")
    )
      return true;

    if (
      href === "/candidate/resume" &&
      location.pathname.startsWith("/candidate/resume")
    )
      return true;

    return location.pathname === href;
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
    <aside className="w-64 bg-white border-r border-gray-200/50 flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="h-8 w-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
          <svg
            className="h-5 w-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-blue-600">RecruitIQ</span>
      </div>

      {/* User Profile */}
      {user && (
        <div className="px-4 py-3 mb-4 mx-3 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {sidebarItems.map((item) => {
          const routeExists = defaultSidebarItems.some(
            (sidebarItem) => sidebarItem.href === item.href,
          );

          return (
            <button
              key={item.label}
              onClick={() => {
                if (routeExists) {
                  navigate(item.href);
                } else {
                  console.log(`Route ${item.href} not implemented yet`);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                isActive(item.href)
                  ? "bg-linear-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
              } ${
                !routeExists
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={!routeExists}
              title={!routeExists ? "Coming soon" : ""}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>

              {!routeExists && (
                <span className="ml-auto text-xs text-gray-400">Soon</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </button>

        <div className="mt-4 text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-1">Need help?</p>
          <p>Contact support@recruitiq.com</p>
        </div>
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
  {
    icon: FileText,
    label: "My Resume",
    href: "/candidate/resume",
  },
];
