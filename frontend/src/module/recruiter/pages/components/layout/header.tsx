import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Bell,
  LayoutDashboard,
  Search,
  Building2,
  MessageSquare,
  User,
  Briefcase,
  FileText,
  Calendar,
  CreditCard,
  Users,
  UserCheck,
  UserPlus,
  Package,
  Mail,
  ScrollText,
  History,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/module/auth/hooks/useLogout";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/module/notification/hook/useNotifications";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string | null;
  items: NavItem[];
}

const DASHBOARD_PREFIXES = ["/candidate", "/recruiter", "/admin"];

function isDashboardRoute(pathname: string): boolean {
  return DASHBOARD_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isActiveRoute(pathname: string, href: string): boolean {
  if (href.startsWith("#")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

function getPublicNav(role: string | null): NavItem[] {
  const jobsHref =
    role === "candidate"
      ? "/candidate/jobs"
      : role === "recruiter"
        ? "/recruiter/jobs"
        : "/jobs";

  return [
    { label: "Features", href: "#features", icon: Sparkles },
    { label: "Jobs", href: jobsHref, icon: Briefcase },
    { label: "About", href: "/aboutUs", icon: Users },
    { label: "Contact", href: "#contact", icon: Mail },
  ];
}

const candidateNav: NavGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/candidate/home", icon: LayoutDashboard },
      {
        label: "My Applications",
        href: "/candidate/applications",
        icon: Building2,
      },
      { label: "Browse Jobs", href: "/candidate/jobs", icon: Search },
      {
        label: "Interviews",
        href: "/candidate/interviews",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My Profile", href: "/candidate/profile/setting", icon: User },
    ],
  },
];

const recruiterNav: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/recruiter/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Jobs", href: "/recruiter/jobs", icon: Briefcase },
      {
        label: "Applications",
        href: "/recruiter/applications",
        icon: FileText,
      },
      { label: "Interviews", href: "/recruiter/interviews", icon: Calendar },
      { label: "Billing", href: "/recruiter/plans", icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", href: "/recruiter/profile", icon: User }],
  },
];

const adminNav: NavGroup[] = [
  {
    title: "General",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Recruiters", href: "/admin/recruiters", icon: Users },
      { label: "Candidates", href: "/admin/candidates", icon: UserCheck },
      { label: "Job Posts", href: "/admin/jobPosts", icon: Briefcase },
      { label: "Subscribers", href: "/admin/subscribers", icon: UserPlus },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Plans", href: "/admin/plans", icon: Package },
      { label: "Email Templates", href: "/admin/email-templates", icon: Mail },
      { label: "Email Logs", href: "/admin/email-logs", icon: ScrollText },
      { label: "Activity Logs", href: "/admin/activity-logs", icon: History },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function getDashboardNav(role: string | null): NavGroup[] {
  if (role === "candidate") return candidateNav;
  if (role === "recruiter") return recruiterNav;
  if (role === "admin") return adminNav;
  return [];
}

function flattenNav(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((g) => g.items);
}

function getPageTitle(pathname: string, role: string | null): string {
  const items = flattenNav(getDashboardNav(role));
  let best: NavItem | null = null;
  for (const item of items) {
    if (isActiveRoute(pathname, item.href)) {
      if (!best || item.href.length > best.href.length) best = item;
    }
  }
  return best?.label ?? "Dashboard";
}

function getNotificationPath(role: string | null): string {
  if (role === "recruiter") return "/recruiter/notification";
  if (role === "admin") return "/admin/dashboard";
  return "/candidate/notification";
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

function getRoleDisplay(role: string | null): string {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";
}

function getRoleColor(role: string | null): string {
  if (role === "recruiter") return "from-violet-500 to-purple-600";
  if (role === "admin") return "from-rose-500 to-red-600";
  return "from-blue-500 to-cyan-500";
}

function getRoleBadgeColor(role: string | null): string {
  if (role === "recruiter")
    return "bg-violet-100 text-violet-700 ring-1 ring-violet-200";
  if (role === "admin") return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  return "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200";
}

/** Real internal routes use client-side Link; "#hash" anchors use a plain <a>. */
const DrawerNavItem: React.FC<{
  item: NavItem;
  active: boolean;
  onClick: () => void;
}> = ({ item, active, onClick }) => {
  const { label, href, icon: Icon } = item;
  const className = cn(
    "group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg",
    "text-sm transition-all duration-100 active:scale-[0.98]",
    active ? "bg-cyan-50 shadow-sm" : "hover:bg-gray-50",
  );
  const content = (
    <>
      <span
        className={cn(
          "absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-500 transition-opacity duration-150",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        className={cn(
          "h-7.5 w-7.5 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          active ? "bg-cyan-100" : "bg-gray-100 group-hover:bg-gray-200",
        )}
      >
        <Icon
          className={cn("h-4 w-4", active ? "text-cyan-700" : "text-gray-500")}
        />
      </span>
      <span
        className={cn(
          "flex-1 text-left truncate",
          active ? "text-cyan-700 font-semibold" : "text-gray-600 font-medium",
        )}
      >
        {label}
      </span>
    </>
  );

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
};

const NavLink: React.FC<{
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}> = ({ href, label, active, onClick }) => (
  <Link
    to={href}
    onClick={onClick}
    className={cn(
      "relative text-sm font-semibold px-3 py-2 xl:px-4 rounded-lg transition-all duration-200",
      active
        ? "text-cyan-600 bg-cyan-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
    )}
  >
    {label}
    {active && (
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-cyan-500" />
    )}
  </Link>
);

const NotificationBell: React.FC<{
  unreadCount: number;
  onClick: () => void;
  className?: string;
}> = ({ unreadCount, onClick, className }) => (
  <button
    onClick={onClick}
    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
    className={cn(
      "relative p-2 hover:bg-slate-100 rounded-lg transition",
      "text-gray-500 hover:text-gray-700",
      "focus:outline-none",
      className,
    )}
  >
    <Bell className="w-5 h-5 text-slate-600" />
    {unreadCount > 0 && (
      <span className="absolute top-0.5 right-0.5 min-w-4.5 h-4.5 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold ring-1 ring-white">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    )}
  </button>
);

const SWIPE_CLOSE_THRESHOLD = 60; // px

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem("authToken"),
  );
  const [userRole, setUserRole] = useState<string | null>(() =>
    localStorage.getItem("userRole"),
  );
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem("userFullName"),
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();
  const profileRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const drawerBodyRef = useRef<HTMLDivElement>(null);
  const drawerScrollTop = useRef(0);

  const { unreadCount } = useNotifications();

  const onDashboard = isLoggedIn && isDashboardRoute(location.pathname);
  const PUBLIC_NAV_ITEMS = getPublicNav(userRole);
  const DRAWER_GROUPS: NavGroup[] = onDashboard
    ? getDashboardNav(userRole)
    : [{ title: null, items: PUBLIC_NAV_ITEMS }];
  const pageTitle = getPageTitle(location.pathname, userRole);

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
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useLayoutEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && drawerBodyRef.current) {
      drawerBodyRef.current.scrollTop = drawerScrollTop.current;
    }
  }, [isMenuOpen]);

  const handleDrawerScroll = () => {
    if (drawerBodyRef.current) {
      drawerScrollTop.current = drawerBodyRef.current.scrollTop;
    }
  };

  // Close on Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX < -SWIPE_CLOSE_THRESHOLD) setIsMenuOpen(false);
    touchStartX.current = null;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationClick = () => {
    navigate(getNotificationPath(userRole));
  };

  const getProfilePath = () => {
    if (userRole === "candidate") return "/candidate/profile/setting";
    if (userRole === "recruiter") return "/recruiter/profile";
    if (userRole === "admin") return "/admin/settings";
    return "/profile";
  };

  const initials = getInitials(userName);
  const roleLabel = getRoleDisplay(userRole);
  const roleGrad = getRoleColor(userRole);
  const roleBadge = getRoleBadgeColor(userRole);

  return (
    <>
      {/* ================= Top bar ================= */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-sm shadow-gray-200/80 border-b border-gray-200/60"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100/60",
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* h-16 everywhere (was h-14 on mobile) for more breathing room on small screens */}
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 z-10">
              <button
                onClick={() => setIsMenuOpen((p) => !p)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                className={cn(
                  "lg:hidden relative w-9 h-9 flex items-center justify-center rounded-lg shrink-0",
                  "border border-gray-200 hover:bg-gray-50 transition-all duration-200",
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

              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none min-w-0"
              >
                <div
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 shrink-0",
                    "flex items-center justify-center shadow-md shadow-blue-500/25",
                    "group-hover:shadow-lg group-hover:shadow-cyan-500/35",
                    "transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3",
                  )}
                >
                  <span className="text-white font-black text-xs sm:text-sm tracking-tighter">
                    IQ
                  </span>
                </div>

                <span className="hidden lg:block font-bold text-base sm:text-[1.05rem] tracking-tight text-gray-900 truncate">
                  Recruit
                  <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    IQ
                  </span>
                </span>
              </button>
            </div>

            {/* Mobile/tablet: centered page title on dashboard routes ("Applications") */}
            {onDashboard && (
              <span
                className={cn(
                  "lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "font-bold text-base text-gray-900 truncate max-w-[45%] text-center pointer-events-none",
                )}
              >
                {pageTitle}
              </span>
            )}

            {!onDashboard && (
              <nav className="hidden lg:flex items-center gap-0.5">
                {PUBLIC_NAV_ITEMS.map(({ label, href }) => (
                  <NavLink
                    key={label}
                    href={href}
                    label={label}
                    active={isActiveRoute(location.pathname, href)}
                  />
                ))}
              </nav>
            )}

            <div className="flex items-center gap-1 sm:gap-2 shrink-0 z-10">
              {isLoggedIn ? (
                <>
                  <NotificationBell
                    unreadCount={unreadCount}
                    onClick={handleNotificationClick}
                  />

                  {/* Visible at every breakpoint now: mobile shows just the avatar,
                      the name/role/chevron progressively appear at larger sizes. */}
                  <div ref={profileRef} className="relative">
                    <button
                      onClick={() => setIsProfileOpen((p) => !p)}
                      className={cn(
                        "flex items-center gap-2.5 pl-1 pr-1 py-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-xl",
                        "border transition-all duration-200 focus:outline-none",
                        isProfileOpen
                          ? "border-cyan-300/70 bg-cyan-50/50 shadow-sm shadow-cyan-500/10"
                          : "border-transparent sm:border-gray-200 hover:border-cyan-300/60 hover:bg-gray-50",
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt={userName ?? ""}
                          />
                          <AvatarFallback
                            className={cn(
                              "bg-linear-to-br text-white text-[10px] font-bold",
                              roleGrad,
                            )}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                      </div>

                      <div className="text-left hidden xl:block">
                        <p className="text-sm font-semibold text-gray-900 max-w-28 truncate leading-none">
                          {userName ?? "Profile"}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 inline-block",
                            roleBadge,
                          )}
                        >
                          {roleLabel}
                        </span>
                      </div>

                      <ChevronDown
                        className={cn(
                          "hidden sm:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                          isProfileOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isProfileOpen && (
                      <div
                        className={cn(
                          "absolute right-0 top-[calc(100%+8px)] w-64 max-w-[calc(100vw-1.5rem)]",
                          "bg-white rounded-2xl border border-gray-200/80",
                          "shadow-xl shadow-gray-900/8 py-1.5 z-50",
                          "animate-in fade-in slide-in-from-top-2 duration-150",
                        )}
                      >
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
                                    roleGrad,
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
                                  roleBadge,
                                )}
                              >
                                {roleLabel}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-gray-100 mx-3" />

                        <div className="py-1.5 px-1.5 space-y-0.5">
                          <button
                            onClick={() => {
                              navigate(getProfilePath());
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-700 rounded-lg transition-colors text-left"
                          >
                            <Avatar className="h-4 w-4 shrink-0">
                              <AvatarFallback
                                className={cn(
                                  "bg-linear-to-br text-white text-[8px] font-bold",
                                  roleGrad,
                                )}
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            View profile
                          </button>

                          <button
                            onClick={() => {
                              handleNotificationClick();
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-700 rounded-lg transition-colors text-left"
                          >
                            <div className="relative shrink-0">
                              <Bell className="w-4 h-4 text-gray-400" />
                              {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold bg-red-500 text-white ring-1 ring-white">
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                              )}
                            </div>
                            <span className="flex-1">Notifications</span>
                            {unreadCount > 0 && (
                              <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full border border-red-100">
                                {unreadCount} new
                              </span>
                            )}
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
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/signin")}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className={cn(
                      "px-4 py-2 text-white text-sm font-semibold rounded-xl",
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

      <div
        aria-hidden="true"
        onClick={() => setIsMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal={isMenuOpen}
        aria-hidden={!isMenuOpen}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[85%] max-w-80 lg:hidden",
          "bg-white flex flex-col shadow-xl",
          "transition-all duration-300 ease-out",
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none",
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm shadow-blue-500/25">
              <span className="text-white font-black text-xs tracking-tighter">
                IQ
              </span>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-gray-900">
              Recruit
              <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                IQ
              </span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body: profile card + grouped nav */}
        <div
          ref={drawerBodyRef}
          onScroll={handleDrawerScroll}
          className="flex-1 overflow-y-auto"
        >
          {isLoggedIn && (
            <div className="px-3 pt-3 pb-1">
              <button
                onClick={() => {
                  navigate(getProfilePath());
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt={userName ?? ""}
                  />
                  <AvatarFallback
                    className={cn(
                      "bg-linear-to-br text-white text-xs font-bold",
                      roleGrad,
                    )}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                    {userName ?? "Your Account"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-block",
                        roleBadge,
                      )}
                    >
                      {roleLabel}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Online
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              </button>
            </div>
          )}

          {DRAWER_GROUPS.map((group) => (
            // pt-5 (was pt-3) — a little extra breathing room between sections
            <div key={group.title ?? "ungrouped"} className="px-3 pt-5">
              {group.title && (
                <p className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  {group.title}
                </p>
              )}
              <nav className="space-y-0.5">
                {group.items.map((item) => (
                  <DrawerNavItem
                    key={item.label}
                    item={item}
                    active={isActiveRoute(location.pathname, item.href)}
                    onClick={() => setIsMenuOpen(false)}
                  />
                ))}
              </nav>
            </div>
          ))}
          <div className="h-2" />
        </div>

        <div
          className="border-t border-gray-100 p-3 shrink-0"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all text-left text-sm font-medium"
            >
              <span className="w-7.5 h-7.5 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <LogOut className="w-4 h-4" />
              </span>
              Sign out
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate("/signin");
                  setIsMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "w-full py-2.5 px-4 rounded-xl text-white text-sm font-semibold",
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
      </aside>
    </>
  );
}
