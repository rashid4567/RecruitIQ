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
} from "lucide-react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/module/auth/presentation/hooks/useLogout";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/module/notification/hook/useNotifications";

function getNavItems(role: string | null) {
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

function getNotificationPath(role: string | null): string {
  if (role === "recruiter") return "/recruiter/notification";
  if (role === "admin") return "/admin/notification";
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
      "relative text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200",
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
      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    )}
  </button>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem("authToken"),
  );
  const [userRole, setUserRole] = useState<string | null>(
    () => localStorage.getItem("userRole"),
  );
  const [userName, setUserName] = useState<string | null>(
    () => localStorage.getItem("userFullName"),
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();
  const profileRef = useRef<HTMLDivElement>(null);

  const { unreadCount } = useNotifications();

  const NAV_ITEMS = getNavItems(userRole);

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

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
      setIsProfileOpen(false);
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
    if (userRole === "admin") return "/admin-dashboard";
    return "/profile";
  };

  const initials = getInitials(userName);
  const roleLabel = getRoleDisplay(userRole);
  const roleGrad = getRoleColor(userRole);
  const roleBadge = getRoleBadgeColor(userRole);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-sm shadow-gray-200/80 border-b border-gray-200/60"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100/60",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500",
                  "flex items-center justify-center shadow-md shadow-blue-500/25",
                  "group-hover:shadow-lg group-hover:shadow-cyan-500/35",
                  "transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3",
                )}
              >
                <span className="text-white font-black text-sm tracking-tighter">
                  IQ
                </span>
              </div>
              <span className="hidden sm:block font-bold text-[1.05rem] tracking-tight text-gray-900">
                Recruit
                <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  IQ
                </span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map(({ label, href }) => (
                <NavLink
                  key={label}
                  href={href}
                  label={label}
                  active={location.pathname === href}
                />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <NotificationBell
                    unreadCount={unreadCount}
                    onClick={handleNotificationClick}
                    className="hidden lg:flex"
                  />

                  <div ref={profileRef} className="relative hidden lg:block">
                    <button
                      onClick={() => setIsProfileOpen((p) => !p)}
                      className={cn(
                        "flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl",
                        "border transition-all duration-200 focus:outline-none",
                        isProfileOpen
                          ? "border-cyan-300/70 bg-cyan-50/50 shadow-sm shadow-cyan-500/10"
                          : "border-gray-200 hover:border-cyan-300/60 hover:bg-gray-50",
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

                      <div className="text-left hidden md:block">
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
                          "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                          isProfileOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isProfileOpen && (
                      <div
                        className={cn(
                          "absolute right-0 top-[calc(100%+8px)] w-64",
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

              <button
                onClick={() => setIsMenuOpen((p) => !p)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                className={cn(
                  "lg:hidden relative w-9 h-9 flex items-center justify-center rounded-lg",
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
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            className={cn(
              "absolute top-16 left-0 right-0 bottom-0",
              "bg-white/99 backdrop-blur-md overflow-y-auto",
              "animate-in slide-in-from-top-1 fade-in duration-200",
            )}
          >
            <div className="max-w-7xl mx-auto px-4 pt-5 pb-10 space-y-6">
              {/* Nav links */}
              <nav className="space-y-1">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      location.pathname === href
                        ? "bg-linear-to-r from-cyan-50 to-blue-50/50 text-cyan-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        location.pathname === href
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    {label}
                    {location.pathname === href && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    )}
                  </a>
                ))}
              </nav>

              <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

              {isLoggedIn ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate(getProfilePath());
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl text-left",
                      "bg-linear-to-br from-gray-50 to-gray-100/60",
                      "border border-gray-200 hover:border-cyan-300/60 hover:from-cyan-50/50 hover:to-blue-50/30",
                      "transition-all duration-200",
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt={userName ?? ""}
                        />
                        <AvatarFallback
                          className={cn(
                            "bg-linear-to-br text-white font-bold text-base",
                            roleGrad,
                          )}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-base">
                        {userName ?? "Your Account"}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block",
                          roleBadge,
                        )}
                      >
                        {roleLabel}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => {
                      handleNotificationClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                  >
                    <span className="relative w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-red-500" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold bg-red-500 text-white ring-1 ring-white">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </span>
                    <span className="flex-1">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                        {unreadCount} unread
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50/80 font-medium transition-colors text-left"
                  >
                    <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4" />
                    </span>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl text-white font-semibold",
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
        </div>
      )}
    </>
  );
}