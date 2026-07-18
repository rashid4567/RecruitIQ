import { useEffect, useState } from "react";
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
  ChevronsLeft,
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

const COLLAPSE_KEY = "candidate-nav-collapsed";

export default function CandidateNavigation({
  user,
  sidebarItems = defaultSidebarItems,
  children,
}: CandidateNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading } = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

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

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const Logo = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="h-8 w-8 rounded-[9px] bg-indigo-600 flex items-center justify-center shrink-0">
        <Briefcase className="h-4 w-4 text-white" strokeWidth={2.25} />
      </div>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-neutral-900 truncate">
          Recruit<span className="text-indigo-600">IQ</span>
        </span>
      )}
    </div>
  );

  const UserCard = ({
    closeDrawer = false,
    compact = false,
  }: {
    closeDrawer?: boolean;
    compact?: boolean;
  }) =>
    user ? (
      <div className={compact ? "mx-2 mt-3 mb-1" : "mx-3 mt-3 mb-1"}>
        <button
          onClick={() => goTo("/candidate/profile/setting", closeDrawer)}
          title={compact ? user.fullName : undefined}
          className={`w-full flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 hover:bg-neutral-100 transition-colors ${focusRing} ${
            compact ? "justify-center p-2" : "px-3 py-2.5"
          }`}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-medium text-neutral-900 truncate leading-tight">
                  {user.fullName}
                </p>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
            </>
          )}
        </button>
      </div>
    ) : null;

  const SectionLabel = ({ children: label }: { children: string }) => (
    <p className="px-4.5 pt-4 pb-1.5 text-[10.5px] font-semibold text-neutral-400 uppercase tracking-[0.08em]">
      {label}
    </p>
  );

  const NavList = ({
    closeDrawer = false,
    compact = false,
  }: {
    closeDrawer?: boolean;
    compact?: boolean;
  }) => (
    <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
      {sidebarItems.map((item) => {
        const enabled = !!item.href;
        const active = isActive(item.href);

        return (
          <button
            key={item.label}
            onClick={() => enabled && goTo(item.href, closeDrawer)}
            disabled={!enabled}
            title={compact ? item.label : !enabled ? "Coming soon" : undefined}
            className={`
              group relative w-full flex items-center gap-2.5 rounded-[10px]
              text-[13.5px] transition-all duration-150 ${focusRing}
              ${compact ? "justify-center px-2 py-2.5" : "px-2.5 py-2.5"}
              ${
                active
                  ? "bg-indigo-600"
                  : enabled
                    ? "hover:bg-neutral-100"
                    : "opacity-40 cursor-not-allowed"
              }
            `}
          >
            <span
              className={`
                h-7 w-7 rounded-[7px] flex items-center justify-center shrink-0 transition-colors
                ${
                  active
                    ? "bg-white/15"
                    : "bg-neutral-100 group-hover:bg-white group-hover:shadow-sm group-hover:shadow-neutral-200"
                }
              `}
            >
              <item.icon
                className={`h-4 w-4 ${active ? "text-white" : "text-neutral-500 group-hover:text-neutral-800"}`}
                strokeWidth={2}
              />
            </span>

            {!compact && (
              <>
                <span
                  className={`
                    flex-1 text-left truncate
                    ${active ? "text-white font-medium" : "text-neutral-600 font-normal group-hover:text-neutral-900"}
                  `}
                >
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {!enabled && (
                  <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full shrink-0">
                    Soon
                  </span>
                )}
              </>
            )}

            {compact && item.badge && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>
        );
      })}
    </nav>
  );

  const LogoutButton = ({ compact = false }: { compact?: boolean }) => (
    <div className="border-t border-neutral-100 p-2.5">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        title={compact ? "Log out" : undefined}
        className={`group w-full flex items-center gap-2.5 rounded-[10px] text-[13.5px] transition-colors hover:bg-red-50 disabled:opacity-50 ${focusRing} ${
          compact ? "justify-center px-2 py-2.5" : "px-2.5 py-2.5"
        }`}
      >
        <span className="h-7 w-7 rounded-[7px] bg-neutral-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
          <LogOut
            className="h-4 w-4 text-neutral-400 group-hover:text-red-500"
            strokeWidth={2}
          />
        </span>
        {!compact && (
          <span className="text-neutral-500 group-hover:text-red-600 transition-colors">
            {isLoading ? "Logging out…" : "Log out"}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 flex-col bg-white border-r border-neutral-100 z-20 transition-[width] duration-200 ease-in-out ${
          collapsed ? "w-18.5" : "w-64"
        }`}
      >
        <div
          className={`flex items-center h-16 border-b border-neutral-100 ${
            collapsed ? "justify-center px-2" : "justify-between px-4.5"
          }`}
        >
          <Logo compact={collapsed} />
          {!collapsed && (
            <button
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              className={`p-1 rounded-md text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600 transition-colors shrink-0 ${focusRing}`}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        <UserCard compact={collapsed} />

        {!collapsed ? (
          <SectionLabel>Workspace</SectionLabel>
        ) : (
          <div className="pt-3" />
        )}

        <NavList compact={collapsed} />
        <LogoutButton compact={collapsed} />

        {collapsed && (
          <button
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            className={`absolute -right-3 top-17 h-6 w-6 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-colors ${focusRing}`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </aside>

      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className={`p-1.5 -ml-1.5 rounded-lg hover:bg-neutral-100 transition-colors ${focusRing}`}
          >
            <Menu className="h-5 w-5 text-neutral-700" />
          </button>
          <Logo />
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Notifications"
            className={`relative p-1.5 rounded-lg hover:bg-neutral-100 transition-colors ${focusRing}`}
          >
            <Bell className="h-5 w-5 text-neutral-500" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>
          <button
            onClick={() => goTo("/candidate/profile/setting")}
            aria-label="Profile"
            className={`rounded-full transition-shadow ${focusRing}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-neutral-900/45 animate-in fade-in duration-150"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-75 bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between h-16 px-4.5 border-b border-neutral-100">
              <Logo />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className={`p-1.5 rounded-lg hover:bg-neutral-100 transition-colors ${focusRing}`}
              >
                <X className="h-4.5 w-4.5 text-neutral-500" />
              </button>
            </div>
            <UserCard closeDrawer />
            <SectionLabel>Workspace</SectionLabel>
            <NavList closeDrawer />
            <LogoutButton />
          </aside>
        </div>
      )}

      <nav className="md:hidden fixed bottom-3 inset-x-3 z-30">
        <div className="flex items-stretch bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_24px_-8px_rgba(20,20,25,0.18)] px-1 py-1">
          {sidebarItems.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.label}
                onClick={() => item.href && goTo(item.href)}
                className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-colors ${
                  active ? "bg-indigo-600" : "hover:bg-neutral-50"
                } ${focusRing}`}
              >
                <item.icon
                  className={`h-4.5 w-4.5 ${active ? "text-white" : "text-neutral-400"}`}
                  strokeWidth={2}
                />
                <span
                  className={`text-[9.5px] leading-none ${active ? "text-white font-medium" : "text-neutral-400"}`}
                >
                  {item.label.split(" ")[0]}
                </span>
                {item.badge && !active && (
                  <span className="absolute top-1 right-3 h-1.5 w-1.5 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main
        className={`pb-24 md:pb-6 transition-[padding] duration-200 ease-in-out ${
          collapsed ? "lg:pl-18.5" : "lg:pl-64"
        }`}
      >
        <div className="w-full px-4 lg:px-7 py-5">{children}</div>
      </main>
    </div>
  );
}
