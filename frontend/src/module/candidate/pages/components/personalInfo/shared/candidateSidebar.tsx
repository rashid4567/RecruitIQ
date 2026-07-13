import { useState } from "react";
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
  Menu,
  X,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/module/auth/hooks/useLogout";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string | number;
}

interface CandidateNavigationProps {
  user?: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
  sidebarItems?: SidebarItem[];
  children?: React.ReactNode;
}

const defaultSidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/candidate/home" },
  {
    icon: Building2,
    label: "My Applications",
    href: "/candidate/applications",
  },
  { icon: Search, label: "Browse Jobs", href: "/candidate/jobs" },
  { icon: MessageSquare, label: "Interviews", href: "/candidate/interviews" },
  { icon: User, label: "My Profile", href: "/candidate/profile/setting" },
];

const activeMatchers: Record<string, (p: string) => boolean> = {
  "/candidate/home": (p) => p === "/candidate/home",
  "/candidate/applications": (p) => p.startsWith("/candidate/applications"),
  "/candidate/jobs": (p) => p.startsWith("/candidate/jobs"),
  "/candidate/interviews": (p) => p.startsWith("/candidate/interviews"),
  "/candidate/profile/setting": (p) =>
    p.startsWith("/candidate/profile/setting"),
};

export default function CandidateNavigation({
  user,
  sidebarItems = defaultSidebarItems,
  children,
}: CandidateNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading } = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initials =
    (user?.fullName ?? "")
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
    } finally {
      setDrawerOpen(false);
    }
  };

  const goTo = (href: string, closeDrawer = false) => {
    navigate(href);
    if (closeDrawer) setDrawerOpen(false);
  };

  const Logo = () => (
    <div className="flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
        <Briefcase className="h-4 w-4 text-white" />
      </div>
      <span className="text-[15px] font-medium tracking-tight text-slate-900">
        Recruit<span className="text-blue-600">IQ</span>
      </span>
    </div>
  );

  const UserCard = ({ closeDrawer = false }: { closeDrawer?: boolean }) =>
    user ? (
      <div className="mx-2.5 mt-3 mb-1">
        <button
          onClick={() => goTo("/candidate/profile/setting", closeDrawer)}
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
    ) : null;

  const NavList = ({ closeDrawer = false }: { closeDrawer?: boolean }) => (
    <nav className="flex-1 px-2 space-y-px overflow-y-auto">
      {sidebarItems.map((item) => {
        const enabled = !!item.href;
        const active = isActive(item.href);

        return (
          <button
            key={item.label}
            onClick={() => enabled && goTo(item.href, closeDrawer)}
            disabled={!enabled}
            title={!enabled ? "Coming soon" : undefined}
            className={`
              group relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg
              text-sm transition-colors duration-100
              ${
                active
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

            <span
              className={`
                h-7.5 w-7.5 rounded-[7px] flex items-center justify-center shrink-0 transition-colors
                ${
                  active
                    ? "bg-blue-600"
                    : "bg-slate-100 group-hover:bg-white group-hover:border group-hover:border-slate-200"
                }
              `}
            >
              <item.icon
                className={`h-4 w-4 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-800"}`}
              />
            </span>

            <span
              className={`
                flex-1 text-left font-normal
                ${active ? "text-blue-600 font-medium" : "text-slate-500 group-hover:text-slate-900"}
              `}
            >
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
  );

  const LogoutButton = () => (
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
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop permanent sidebar (>=1024px) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col bg-white border-r border-slate-100 z-20">
        <div className="flex items-center px-4 py-4.5 border-b border-slate-100">
          <Logo />
        </div>
        <UserCard />
        <p className="px-4.5 pt-4 pb-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          Menu
        </p>
        <NavList />
        <LogoutButton />
      </aside>

      {/* Tablet/Mobile sticky header (<1024px) */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>
          <Logo />
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Notifications"
            className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-500" />
          </button>
          <button
            onClick={() => goTo("/candidate/profile/setting")}
            aria-label="Profile"
            className="rounded-full hover:ring-2 hover:ring-slate-100 transition-shadow"
          >
            <Avatar className="h-7.5 w-7.5">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      {/* Drawer overlay (<1024px) */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-75 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-4.5 border-b border-slate-100">
              <Logo />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="h-4.5 w-4.5 text-slate-500" />
              </button>
            </div>
            <UserCard closeDrawer />
            <p className="px-4.5 pt-4 pb-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Menu
            </p>
            <NavList closeDrawer />
            <LogoutButton />
          </aside>
        </div>
      )}

      {/* Bottom tab bar (<768px only) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch h-14 bg-white border-t border-slate-100">
        {sidebarItems.map((item) => {
          const active = isActive(item.href);
          return (
            <button
              key={item.label}
              onClick={() => item.href && goTo(item.href)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
            >
              <item.icon
                className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-400"}`}
              />
              <span
                className={`text-[10px] leading-none ${active ? "text-blue-600 font-medium" : "text-slate-400"}`}
              >
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Page content */}
      <main className="lg:pl-60 pb-14 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
