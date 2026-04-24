import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Briefcase,
  Sparkles,
  Users,
  Mail,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/services/auth/auth.service";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Features", href: "#features", icon: Sparkles },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "About", href: "#about", icon: Users },
  { label: "Contact", href: "#contact", icon: Mail },
];

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
  return "from-blue-500 to-cyan-600";
}

function getRoleBadgeColor(role: string | null): string {
  if (role === "recruiter") return "bg-violet-100 text-violet-700";
  if (role === "admin") return "bg-rose-100 text-rose-700";
  return "bg-cyan-100 text-cyan-700";
}

const NavLink: React.FC<{
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}> = ({ href, label, active, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={cn(
      "relative text-sm font-medium transition-colors duration-200 py-1",
      active ? "text-cyan-600" : "text-gray-600 hover:text-gray-900",
    )}
  >
    {label}
    <span
      className={cn(
        "absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-300",
        active ? "w-full" : "w-0 group-hover:w-full",
      )}
    />
  </a>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const fullName = localStorage.getItem("userFullName");
    setIsLoggedIn(!!token);
    setUserRole(role);
    setUserName(fullName || null);
  }, []);

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

  useEffect(() => {
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
      await authService.logout();
    } catch {
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userFullName");
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
      setIsProfileOpen(false);
      navigate("/");
    }
  };

  const getProfilePath = () => {
    if (userRole === "candidate") return "/candidate/profile/setting";
    if (userRole === "recruiter") return "/recruiter-dashboard";
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
            ? "bg-white/95 backdrop-blur-xl shadow-md shadow-gray-200/60 border-b border-gray-200/80"
            : "bg-white/80 backdrop-blur-lg border-b border-gray-100/60",
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
                  "w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 via-cyan-500 to-blue-700",
                  "flex items-center justify-center shadow-md",
                  "group-hover:shadow-lg group-hover:shadow-cyan-500/30",
                  "transition-all duration-300 group-hover:scale-105",
                )}
              >
                <span className="text-white font-black text-base tracking-tight">
                  RIQ
                </span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">
                Recruit<span className="text-cyan-600">IQ</span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-7">
              {NAV_ITEMS.map(({ label, href }) => (
                <NavLink
                  key={label}
                  href={href}
                  label={label}
                  active={location.pathname === href}
                />
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {isLoggedIn ? (
                /* ── Profile dropdown ── */
                <div ref={profileRef} className="relative hidden lg:block">
                  <button
                    onClick={() => setIsProfileOpen((p) => !p)}
                    className={cn(
                      "flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full",
                      "border border-gray-200/80 hover:border-cyan-300",
                      "hover:bg-gray-50 transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
                    )}
                  >
                    <Avatar className="h-7 w-7">
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

                    <div className="text-left leading-tight hidden md:block">
                      <p className="text-sm font-semibold text-gray-900 max-w-30 truncate">
                        {userName ?? "Profile"}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-px rounded-full inline-block",
                          roleBadge,
                        )}
                      >
                        {roleLabel}
                      </p>
                    </div>

                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                        isProfileOpen ? "rotate-180" : "",
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {isProfileOpen && (
                    <div
                      className={cn(
                        "absolute right-0 top-[calc(100%+8px)] w-56",
                        "bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/60",
                        "py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150",
                      )}
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userName ?? "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Signed in as {roleLabel}
                        </p>
                      </div>

                      <div className="py-1.5">
                        <button
                          onClick={() => {
                            navigate(getProfilePath());
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-700 transition-colors text-left"
                        >
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarFallback
                              className={cn(
                                "bg-linear-to-br text-white text-[10px] font-bold",
                                roleGrad,
                              )}
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          View profile
                        </button>
                      </div>

                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm font-medium text-gray-700 hover:text-cyan-700 transition-colors px-3 py-1.5"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className={cn(
                      "px-5 py-2 text-white text-sm font-semibold rounded-full",
                      "bg-linear-to-r from-blue-600 to-cyan-500",
                      "shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30",
                      "transition-all duration-200 hover:scale-105 active:scale-95",
                    )}
                  >
                    Get started
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen((p) => !p)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                className={cn(
                  "lg:hidden w-9 h-9 flex items-center justify-center rounded-xl",
                  "border border-gray-200 hover:bg-gray-50 transition-all duration-200",
                  isMenuOpen ? "bg-gray-100 border-gray-300" : "",
                )}
              >
                <span
                  className={cn(
                    "transition-all duration-200",
                    isMenuOpen ? "rotate-90 opacity-0 absolute" : "",
                  )}
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </span>
                <span
                  className={cn(
                    "transition-all duration-200",
                    isMenuOpen ? "" : "rotate-90 opacity-0 absolute",
                  )}
                >
                  <X className="w-5 h-5 text-gray-700" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className={cn(
              "absolute top-16 left-0 right-0 bottom-0",
              "bg-white overflow-y-auto",
              "animate-in slide-in-from-top-2 fade-in duration-200",
            )}
          >
            <div className="max-w-7xl mx-auto px-5 pt-6 pb-10 space-y-8">
              {/* Nav links */}
              <nav className="space-y-1">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-150",
                      location.pathname === href
                        ? "bg-cyan-50 text-cyan-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        location.pathname === href
                          ? "bg-cyan-100"
                          : "bg-gray-100",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    {label}
                  </a>
                ))}
              </nav>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Auth section */}
              {isLoggedIn ? (
                <div className="space-y-3">
                  {/* Profile card */}
                  <button
                    onClick={() => {
                      navigate(getProfilePath());
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100/80 border border-gray-200/60 hover:border-cyan-300 transition-all duration-200 text-left"
                  >
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
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {userName ?? "Your Account"}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          roleBadge,
                        )}
                      >
                        {roleLabel}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 shrink-0" />
                  </button>

                  {/* Sign out */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
                  >
                    <span className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4" />
                    </span>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-3.5 px-5 rounded-2xl border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full py-3.5 px-5 rounded-2xl text-white font-semibold text-center",
                      "bg-linear-to-r from-blue-600 to-cyan-500",
                      "shadow-md shadow-cyan-500/20 active:scale-95 transition-all",
                    )}
                  >
                    Get started — it's free
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
