import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Briefcase,
  Sparkles,
  Users,
  Mail,
  ArrowRight,
  Bell,
  LayoutGrid,
  FileText,
  CalendarCheck,
  Settings,
  HelpCircle,
  Tag,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/module/auth/hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/module/notification/hook/useNotifications";

type Role = "candidate" | "recruiter" | "admin" | null;

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  iconColor: "blue" | "violet" | "emerald" | "orange" | "cyan" | "rose";
};

function getNavItems(role: Role): NavItem[] {
  if (role === "recruiter") {
    return [
      {
        label: "Dashboard",
        href: "/recruiter/dashboard",
        icon: LayoutGrid,
        iconColor: "blue",
      },
      {
        label: "Jobs",
        href: "/recruiter/jobs",
        icon: Briefcase,
        iconColor: "violet",
      },
      {
        label: "Applications",
        href: "/recruiter/applications",
        icon: Users,
        iconColor: "emerald",
      },
      {
        label: "Interviews",
        href: "/recruiter/interviews",
        icon: CalendarCheck,
        iconColor: "orange",
      },
    ];
  }
  if (role === "candidate") {
    return [
      {
        label: "Dashboard",
        href: "/candidate/home",
        icon: LayoutGrid,
        iconColor: "blue",
      },
      {
        label: "Jobs",
        href: "/candidate/jobs",
        icon: Briefcase,
        iconColor: "violet",
      },
      {
        label: "Applications",
        href: "/candidate/applications",
        icon: FileText,
        iconColor: "emerald",
      },
      {
        label: "Interviews",
        href: "/candidate/interviews",
        icon: CalendarCheck,
        iconColor: "orange",
      },
    ];
  }

  return [
    { label: "Features", href: "#features", icon: Sparkles, iconColor: "blue" },
    { label: "Pricing", href: "#pricing", icon: Tag, iconColor: "violet" },
    { label: "About", href: "#about", icon: Users, iconColor: "emerald" },
    { label: "Contact", href: "#contact", icon: Mail, iconColor: "orange" },
  ];
}

const ICON_BG: Record<NavItem["iconColor"], string> = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-600",
  cyan: "bg-cyan-50 text-cyan-600",
  rose: "bg-rose-50 text-rose-600",
};

const ROLE_THEME: Record<
  "candidate" | "recruiter" | "admin" | "guest",
  {
    grad: string;
    text: string;
    activeBg: string;
    activeText: string;
    badge: string;
    ring: string;
    dot: string;
  }
> = {
  candidate: {
    grad: "from-blue-500 to-cyan-500",
    text: "text-blue-600",
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
    badge: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    ring: "focus-visible:ring-blue-500",
    dot: "bg-blue-500",
  },
  recruiter: {
    grad: "from-emerald-500 to-green-600",
    text: "text-emerald-600",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    ring: "focus-visible:ring-emerald-500",
    dot: "bg-emerald-500",
  },
  admin: {
    grad: "from-rose-500 to-red-600",
    text: "text-rose-600",
    activeBg: "bg-rose-50",
    activeText: "text-rose-700",
    badge: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    ring: "focus-visible:ring-rose-500",
    dot: "bg-rose-500",
  },
  guest: {
    grad: "from-blue-600 to-cyan-500",
    text: "text-cyan-600",
    activeBg: "bg-cyan-50",
    activeText: "text-cyan-700",
    badge: "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200",
    ring: "focus-visible:ring-cyan-500",
    dot: "bg-cyan-500",
  },
};

function getTheme(role: Role) {
  if (role === "recruiter") return ROLE_THEME.recruiter;
  if (role === "candidate") return ROLE_THEME.candidate;
  if (role === "admin") return ROLE_THEME.admin;
  return ROLE_THEME.guest;
}

function getInitials(name: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleDisplay(role: Role): string {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest";
}

function getNotificationPath(role: Role): string {
  if (role === "recruiter") return "/recruiter/notification";
  if (role === "admin") return "/admin/notifications";
  return "/candidate/notification";
}

function getProfilePath(role: Role): string {
  if (role === "candidate") return "/candidate/profile/setting";
  if (role === "recruiter") return "/recruiter-dashboard";
  if (role === "admin") return "/admin-dashboard";
  return "/profile";
}

function getDashboardPath(role: Role): string {
  if (role === "candidate") return "/candidate/home";
  if (role === "recruiter") return "/recruiter-dashboard";
  if (role === "admin") return "/admin-dashboard";
  return "/";
}

function getSettingsPath(role: Role): string {
  if (role === "candidate") return "/candidate/settings";
  if (role === "recruiter") return "/recruiter/settings";
  if (role === "admin") return "/admin/settings";
  return "/settings";
}

function getHeaderSubtitle(role: Role): string {
  if (role === "recruiter") return "Hiring Workspace";
  if (role === "admin") return "Admin Workspace";
  return "AI Recruitment Platform";
}

function getUserStats(): {
  activeJobs?: number;
  applications?: number;
  profileCompletion?: number;
} {
  try {
    const raw = localStorage.getItem("userStats");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Viewport tier. Desktop shows the full nav, tablet shows a trimmed nav with
// an overflow "More" menu, mobile relies on the drawer instead of squeezing
// items into the top bar.
// ---------------------------------------------------------------------------
type Viewport = "mobile" | "tablet" | "desktop";

const NAV_VISIBLE_COUNT: Record<Viewport, number> = {
  mobile: 0,
  tablet: 3,
  desktop: 4,
};

function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>("desktop");

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    const tabletMq = window.matchMedia("(min-width: 768px)");

    const update = () => {
      if (desktopMq.matches) setViewport("desktop");
      else if (tabletMq.matches) setViewport("tablet");
      else setViewport("mobile");
    };

    update();
    desktopMq.addEventListener("change", update);
    tabletMq.addEventListener("change", update);
    return () => {
      desktopMq.removeEventListener("change", update);
      tabletMq.removeEventListener("change", update);
    };
  }, []);

  return viewport;
}

const NavLink: React.FC<{
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  theme: ReturnType<typeof getTheme>;
}> = ({ href, label, icon: Icon, active, theme }) => (
  <a
    href={href}
    aria-current={active ? "page" : undefined}
    className={cn(
      "relative flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
      theme.ring,
      active
        ? cn(theme.activeBg, theme.activeText)
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
    )}
  >
    <Icon className="w-3.5 h-3.5 shrink-0" />
    {label}
    {active && (
      <span
        className={cn(
          "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full",
          theme.dot,
        )}
      />
    )}
  </a>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifPreviewOpen, setIsNotifPreviewOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<Role>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const notifTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notificationsHook = useNotifications() as {
    unreadCount: number;
    notifications?: Array<{
      id?: string | number;
      title?: string;
      message?: string;
      body?: string;
      time?: string;
      createdAt?: string;
    }>;
  };
  const unreadCount = notificationsHook?.unreadCount ?? 0;
  const recentNotifications = Array.isArray(notificationsHook?.notifications)
    ? notificationsHook.notifications.slice(0, 5)
    : [];

  const NAV_ITEMS = useMemo(() => getNavItems(userRole), [userRole]);
  const theme = getTheme(userRole);
  const stats = useMemo(() => (isLoggedIn ? getUserStats() : {}), [isLoggedIn]);
  const viewport = useViewport();
  const visibleNavCount = NAV_VISIBLE_COUNT[viewport];
  const visibleNavItems = NAV_ITEMS.slice(0, visibleNavCount);
  const overflowNavItems = NAV_ITEMS.slice(visibleNavCount);

  const readAuthState = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") as Role;
    const fullName = localStorage.getItem("userFullName");
    const email = localStorage.getItem("userEmail");
    const company = localStorage.getItem("companyName");
    setIsLoggedIn(!!token);
    setUserRole(role);
    setUserName(fullName || null);
    setUserEmail(email || null);
    setUserCompany(company || null);
  }, []);

  useEffect(() => {
    readAuthState();
  }, [readAuthState, location.pathname]);

  useEffect(() => {
    window.addEventListener("storage", readAuthState);
    return () => window.removeEventListener("storage", readAuthState);
  }, [readAuthState]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifPreviewOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsNotifPreviewOpen(false);
    setIsMoreOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open; always restore on unmount.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Focus management: move focus into the drawer on open, trap Tab/Shift+Tab
  // inside it, close on Escape, and restore focus to the menu button on close.
  useEffect(() => {
    if (!isMenuOpen) return;

    const drawer = drawerRef.current;
    const focusables = drawer?.querySelectorAll<HTMLElement>(
      'button, a[href], input, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !focusables || focusables.length === 0) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [isMenuOpen]);

  const openNotifPreview = () => {
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    setIsNotifPreviewOpen(true);
  };
  const closeNotifPreviewDelayed = () => {
    notifTimeoutRef.current = setTimeout(
      () => setIsNotifPreviewOpen(false),
      150,
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
      setUserEmail(null);
      setUserCompany(null);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationClick = () => {
    setIsNotifPreviewOpen(false);
    navigate(getNotificationPath(userRole));
  };

  const initials = getInitials(userName);
  const roleLabel = getRoleDisplay(userRole);

  return (
    <>
      {/* Gentle 6s bell sway instead of a constant pulse — noticeable once, not distracting. */}
      <style>{`
        @keyframes bell-ring {
          0%, 82%, 100% { transform: scale(1) rotate(0deg); }
          86% { transform: scale(1.12) rotate(-10deg); }
          90% { transform: scale(1.06) rotate(8deg); }
          94% { transform: scale(1.02) rotate(-4deg); }
        }
        .animate-bell-ring { animation: bell-ring 6s ease-in-out infinite; transform-origin: top center; }
      `}</style>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-[0_1px_0_0_rgba(15,23,42,0.06),0_12px_28px_-14px_rgba(15,23,42,0.18)] border-b border-gray-200/50"
            : "bg-white/80 backdrop-blur-md border-b border-gray-100/50",
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center gap-2 transition-[height] duration-300",
              "h-16 md:h-17",
              scrolled ? "lg:h-16" : "lg:h-18",
            )}
          >
            {/* Mobile menu trigger — leftmost on small screens, one-handed thumb reach */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className={cn(
                "md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg shrink-0",
                "border border-gray-200 hover:bg-gray-50 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2",
                theme.ring,
                isMenuOpen && "bg-gray-100 border-gray-300",
              )}
            >
              <span
                className={cn(
                  "absolute transition-all duration-200",
                  isMenuOpen ? "opacity-0 rotate-45" : "opacity-100",
                )}
              >
                <Menu className="w-4.5 h-4.5 text-gray-700" />
              </span>
              <span
                className={cn(
                  "absolute transition-all duration-200",
                  isMenuOpen ? "opacity-100" : "opacity-0 -rotate-45",
                )}
              >
                <X className="w-4.5 h-4.5 text-gray-700" />
              </span>
            </button>

            {/* Brand */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg shrink-0 min-w-0"
            >
              <div
                style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br shrink-0",
                  theme.grad,
                  "flex items-center justify-center shadow-md shadow-blue-500/20",
                  "transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3",
                )}
              >
                <span className="text-white font-black text-xs sm:text-sm tracking-tighter">
                  RF
                </span>
              </div>
              <span className="flex flex-col items-start leading-none min-w-0">
                <span className="font-bold text-sm sm:text-[1.05rem] tracking-tight text-gray-900 truncate">
                  Recruit
                  <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Flow
                  </span>
                </span>
                <span className="hidden lg:block text-[10px] font-medium text-gray-400 mt-0.5 tracking-wide">
                  {getHeaderSubtitle(userRole)}
                </span>
              </span>
            </button>

            {/* Nav — tablet and up. Trims to a "More" menu once it would
                crowd the bar. */}
            <div className="hidden md:flex flex-1 items-center min-w-0 px-1">
              <nav className="flex items-center gap-0.5 shrink-0">
                {visibleNavItems.map((item) => (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={location.pathname === item.href}
                    theme={theme}
                  />
                ))}

                {overflowNavItems.length > 0 && (
                  <div ref={moreRef} className="relative">
                    <button
                      onClick={() => setIsMoreOpen((p) => !p)}
                      aria-expanded={isMoreOpen}
                      className={cn(
                        "flex items-center gap-1 text-sm font-semibold px-3.5 py-2 rounded-lg transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                        theme.ring,
                        isMoreOpen
                          ? cn(theme.activeBg, theme.activeText)
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
                      )}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                      More
                      <ChevronDown
                        className={cn(
                          "w-3 h-3 transition-transform duration-200",
                          isMoreOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isMoreOpen && (
                      <div className="absolute left-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-900/8 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {overflowNavItems.map((item) => {
                          const Icon = item.icon;
                          const active = location.pathname === item.href;
                          return (
                            <a
                              key={item.label}
                              href={item.href}
                              aria-current={active ? "page" : undefined}
                              onClick={() => setIsMoreOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 mx-1.5 px-3 py-2 rounded-lg text-sm transition-colors",
                                active
                                  ? cn(
                                      theme.activeBg,
                                      theme.activeText,
                                      "font-semibold",
                                    )
                                  : "text-gray-700 hover:bg-gray-50 font-medium",
                              )}
                            >
                              <span
                                className={cn(
                                  "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                                  ICON_BG[item.iconColor],
                                )}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              {item.label}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto md:ml-0">
              {isLoggedIn ? (
                <>
                  {/* Notification bell with hover preview (tablet + desktop) */}
                  <div
                    ref={notifRef}
                    className="relative hidden md:block"
                    onMouseEnter={openNotifPreview}
                    onMouseLeave={closeNotifPreviewDelayed}
                  >
                    <button
                      onClick={handleNotificationClick}
                      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                      aria-expanded={isNotifPreviewOpen}
                      className={cn(
                        "relative flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
                        "border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                        "text-gray-500 hover:text-gray-700",
                        "transition-all duration-200 focus:outline-none focus-visible:ring-2",
                        theme.ring,
                      )}
                    >
                      <Bell className="w-4.5 h-4.5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold leading-none bg-linear-to-br from-rose-500 to-red-500 text-white shadow-sm shadow-red-400/40 ring-2 ring-white animate-bell-ring">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {isNotifPreviewOpen && (
                      <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-900/8 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            Notifications
                          </p>
                          {unreadCount > 0 && (
                            <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto py-1 divide-y divide-gray-50">
                          {recentNotifications.length > 0 ? (
                            recentNotifications.map((n, i) => (
                              <div
                                key={n.id ?? i}
                                className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={handleNotificationClick}
                              >
                                <span
                                  className={cn(
                                    "mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                                    theme.activeBg,
                                    theme.text,
                                  )}
                                >
                                  <Bell className="w-3.5 h-3.5" />
                                </span>
                                <div className="min-w-0">
                                  <p className="text-sm text-gray-800 truncate">
                                    {n.title ||
                                      n.message ||
                                      n.body ||
                                      "Notification"}
                                  </p>
                                  {(n.time || n.createdAt) && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {n.time || n.createdAt}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="px-4 py-6 text-sm text-gray-400 text-center">
                              You're all caught up
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleNotificationClick}
                          className={cn(
                            "w-full text-center text-sm font-semibold py-2.5 border-t border-gray-100 transition-colors",
                            theme.text,
                            "hover:bg-gray-50",
                          )}
                        >
                          View all
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Compact bell for true mobile top bar */}
                  <button
                    onClick={handleNotificationClick}
                    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                    className={cn(
                      "relative flex md:hidden items-center justify-center w-8 h-8 rounded-xl shrink-0",
                      "border border-gray-200 hover:bg-gray-50 text-gray-500",
                      "transition-all duration-200 focus:outline-none focus-visible:ring-2",
                      theme.ring,
                    )}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold bg-rose-500 text-white ring-2 ring-white animate-bell-ring">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Avatar visible on mobile top bar too — builds trust/confidence */}
                  <button
                    onClick={() => navigate(getProfilePath(userRole))}
                    aria-label="View profile"
                    className="flex md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt={userName ?? ""}
                      />
                      <AvatarFallback
                        className={cn(
                          "bg-linear-to-br text-white text-[10px] font-bold",
                          theme.grad,
                        )}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {/* Tablet/desktop profile trigger — name/role/workspace fill the row instead of empty space */}
                  <div ref={profileRef} className="relative hidden md:block">
                    <button
                      onClick={() => setIsProfileOpen((p) => !p)}
                      aria-expanded={isProfileOpen}
                      className={cn(
                        "flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl",
                        "border transition-all duration-200 focus:outline-none focus-visible:ring-2",
                        theme.ring,
                        isProfileOpen
                          ? cn(theme.activeBg, "border-gray-200 shadow-sm")
                          : "border-gray-200 hover:bg-gray-50",
                      )}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt={userName ?? ""}
                          />
                          <AvatarFallback
                            className={cn(
                              "bg-linear-to-br text-white text-[10px] font-bold",
                              theme.grad,
                            )}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                      </div>

                      <div className="text-left hidden lg:block min-w-0">
                        <p className="text-sm font-semibold text-gray-900 max-w-32 truncate leading-tight">
                          {userName ?? "Profile"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-40 leading-tight mt-0.5">
                          {userCompany || roleLabel}
                        </p>
                      </div>

                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0",
                          isProfileOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-900/8 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-3 mb-1">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src="https://github.com/shadcn.png"
                                  alt={userName ?? ""}
                                />
                                <AvatarFallback
                                  className={cn(
                                    "bg-linear-to-br text-white font-bold text-sm",
                                    theme.grad,
                                  )}
                                >
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {userName ?? "User"}
                              </p>
                              <span
                                className={cn(
                                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-block mt-0.5",
                                  theme.badge,
                                )}
                              >
                                {roleLabel}
                              </span>
                              {userCompany && (
                                <p className="text-xs text-gray-400 truncate mt-1">
                                  {userCompany}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-gray-100 mx-3" />

                        <div className="py-1.5 px-1.5 space-y-0.5">
                          <button
                            onClick={() => {
                              navigate(getDashboardPath(userRole));
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <LayoutGrid className="w-4 h-4 text-gray-400 shrink-0" />
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              navigate(getProfilePath(userRole));
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <Avatar className="h-4 w-4 shrink-0">
                              <AvatarFallback
                                className={cn(
                                  "bg-linear-to-br text-white text-[8px] font-bold",
                                  theme.grad,
                                )}
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              handleNotificationClick();
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <Bell className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                              <span className="ml-auto text-[10px] font-semibold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              navigate(getSettingsPath(userRole));
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <Settings className="w-4 h-4 text-gray-400 shrink-0" />
                            Settings
                          </button>
                          <button
                            onClick={() => {
                              navigate("/help");
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                          >
                            <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                            Help
                          </button>
                        </div>

                        <div className="h-px bg-gray-100 mx-3" />

                        <div className="py-1.5 px-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className={cn(
                      "px-4 py-2 text-white text-sm font-semibold rounded-2xl",
                      "bg-linear-to-r from-blue-600 to-cyan-500",
                      "shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/35",
                      "transition-all duration-200 hover:scale-105 active:scale-95",
                      "flex items-center gap-1.5",
                    )}
                  >
                    Get started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-gray-900/35 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            ref={drawerRef}
            className={cn(
              "absolute top-0 right-0 h-full w-[90vw] max-w-90",
              "bg-white shadow-2xl shadow-gray-900/20 rounded-l-3xl overflow-hidden",
              "flex flex-col",
              "animate-in fade-in zoom-in-95 slide-in-from-right duration-300 ease-out",
            )}
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 shrink-0">
              <span className="flex flex-col leading-none">
                <span className="font-bold text-base tracking-tight text-gray-900">
                  Recruit
                  <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Flow
                  </span>
                </span>
                <span className="text-[10px] font-medium text-gray-400 mt-0.5 tracking-wide">
                  {getHeaderSubtitle(userRole)}
                </span>
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <X className="w-4.5 h-4.5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable middle — logout and guest CTAs live in the sticky footer below, not here */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-5 pb-6">
              {/* Profile card */}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    navigate(getProfilePath(userRole));
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3.5 p-4 rounded-2xl text-left mb-3",
                    "bg-linear-to-br from-gray-50 to-gray-100/60 border border-gray-200",
                    "hover:border-gray-300 transition-all duration-200",
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt={userName ?? ""}
                      />
                      <AvatarFallback
                        className={cn(
                          "bg-linear-to-br text-white font-bold text-base",
                          theme.grad,
                        )}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">
                      {userName ?? "Your Account"}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 inline-block",
                        theme.badge,
                      )}
                    >
                      {roleLabel}
                    </span>
                    {userCompany && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {userCompany}
                      </p>
                    )}
                    {!userCompany && userEmail && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {userEmail}
                      </p>
                    )}
                  </div>
                </button>
              )}

              {/* Role-specific quick stats — only shown when real data is present */}
              {isLoggedIn &&
                (stats.activeJobs !== undefined ||
                  stats.applications !== undefined ||
                  stats.profileCompletion !== undefined) && (
                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    {stats.profileCompletion !== undefined && (
                      <div className="rounded-2xl border border-gray-200 px-3.5 py-3">
                        <p className="text-xl font-bold text-gray-900 leading-none">
                          {stats.profileCompletion}%
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1.5">
                          Profile complete
                        </p>
                      </div>
                    )}
                    {stats.activeJobs !== undefined && (
                      <div className="rounded-2xl border border-gray-200 px-3.5 py-3">
                        <p className="text-xl font-bold text-gray-900 leading-none">
                          {stats.activeJobs}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1.5">
                          Active jobs
                        </p>
                      </div>
                    )}
                    {stats.applications !== undefined && (
                      <div className="rounded-2xl border border-gray-200 px-3.5 py-3">
                        <p className="text-xl font-bold text-gray-900 leading-none">
                          {stats.applications}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1.5">
                          Applications
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {/* MAIN section */}
              <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {isLoggedIn ? "Main" : "Menu"}
              </p>
              <nav className="space-y-1 mb-5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.href;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl transition-all duration-200 border-l-4",
                        active
                          ? cn(
                              "border-l-current",
                              theme.activeBg,
                              theme.activeText,
                              "font-semibold",
                            )
                          : "border-l-transparent text-gray-700 hover:bg-gray-50 font-medium",
                      )}
                    >
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          ICON_BG[item.iconColor],
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              {isLoggedIn && (
                <>
                  <div className="h-px bg-gray-100 mx-2 mb-5" />

                  {/* ACCOUNT section */}
                  <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Account
                  </p>
                  <div className="space-y-1 mb-5">
                    <button
                      onClick={() => {
                        handleNotificationClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                    >
                      <span className="relative w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4 text-rose-500" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold bg-rose-500 text-white ring-1 ring-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </span>
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto text-xs font-semibold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        navigate(getProfilePath(userRole));
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                    >
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          ICON_BG.blue,
                        )}
                      >
                        <Users className="w-4 h-4" />
                      </span>
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate(getSettingsPath(userRole));
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                    >
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          ICON_BG.violet,
                        )}
                      >
                        <Settings className="w-4 h-4" />
                      </span>
                      Settings
                    </button>
                  </div>

                  <div className="h-px bg-gray-100 mx-2 mb-5" />

                  {/* SUPPORT section */}
                  <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Support
                  </p>
                  <div className="space-y-1">
                    <a
                      href="/help"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                    >
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          ICON_BG.cyan,
                        )}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </span>
                      Help
                    </a>
                    <a
                      href="#contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                    >
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          ICON_BG.orange,
                        )}
                      >
                        <Mail className="w-4 h-4" />
                      </span>
                      Contact
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Sticky footer — sign out (or guest CTAs) always reachable, never scrolls away */}
            {isLoggedIn ? (
              <div className="shrink-0 border-t border-gray-100 p-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50/80 font-semibold transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4" />
                  </span>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="shrink-0 border-t border-gray-100 p-4 space-y-2.5">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-2xl border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "w-full py-3 px-4 rounded-2xl text-white font-semibold",
                    "bg-linear-to-r from-blue-600 to-cyan-500",
                    "shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all",
                    "flex items-center justify-center gap-2",
                  )}
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
