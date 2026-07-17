import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Check,
  ChevronDown,
  FileText,
  History,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Settings,
  ShieldCheck,
  Tag,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/module/auth/hooks/useLogout";
import { cn } from "@/lib/utils";

type PageInfo = {
  title: string;
  description?: string;
};

type AdminNavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  iconColor:
    | "indigo"
    | "violet"
    | "emerald"
    | "orange"
    | "cyan"
    | "rose"
    | "blue";
};

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutGrid,
    iconColor: "indigo",
  },
  {
    label: "Activity Logs",
    href: "/admin/activity-logs",
    icon: History,
    iconColor: "violet",
  },
  {
    label: "Recruiters",
    href: "/admin/recruiters",
    icon: Users,
    iconColor: "blue",
  },
  {
    label: "Candidates",
    href: "/admin/candidates",
    icon: UserRound,
    iconColor: "emerald",
  },
  {
    label: "Job Posts",
    href: "/admin/jobPosts",
    icon: Briefcase,
    iconColor: "orange",
  },
  {
    label: "Subscribers",
    href: "/admin/subscribers",
    icon: Tag,
    iconColor: "cyan",
  },
  { label: "Plans", href: "/admin/plans", icon: Tag, iconColor: "rose" },
  {
    label: "Email Templates",
    href: "/admin/email-templates",
    icon: Mail,
    iconColor: "indigo",
  },
  {
    label: "Email Logs",
    href: "/admin/email-logs",
    icon: FileText,
    iconColor: "blue",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    iconColor: "violet",
  },
];

const ICON_BG: Record<AdminNavItem["iconColor"], string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-600",
  cyan: "bg-cyan-50 text-cyan-600",
  rose: "bg-rose-50 text-rose-600",
  blue: "bg-blue-50 text-blue-600",
};

const ADMIN_PAGES: Array<{
  match: string;
  page: PageInfo;
}> = [
  {
    match: "/admin/settings/change-password",
    page: {
      title: "Change Password",
      description: "Manage your administrator account security",
    },
  },
  {
    match: "/admin/dashboard",
    page: {
      title: "Dashboard",
      description: "Overview of your platform",
    },
  },
  {
    match: "/admin/activity-logs",
    page: {
      title: "Activity Logs",
      description: "Monitor platform activity and events",
    },
  },
  {
    match: "/admin/recruiters",
    page: {
      title: "Recruiter Management",
      description: "Manage recruiter accounts and access",
    },
  },
  {
    match: "/admin/candidates",
    page: {
      title: "Candidate Management",
      description: "Manage candidate accounts",
    },
  },
  {
    match: "/admin/jobPosts",
    page: {
      title: "Job Post Management",
      description: "Review and manage job postings",
    },
  },
  {
    match: "/admin/subscribers",
    page: {
      title: "Subscribers",
      description: "Manage platform subscriptions",
    },
  },
  {
    match: "/admin/plans",
    page: {
      title: "Plans Overview",
      description: "Manage subscription plans and pricing",
    },
  },
  {
    match: "/admin/email-templates",
    page: {
      title: "Email Templates",
      description: "Manage system email templates",
    },
  },
  {
    match: "/admin/email-logs",
    page: {
      title: "Email Logs",
      description: "Review email delivery activity",
    },
  },
  {
    match: "/admin/settings",
    page: {
      title: "Settings",
      description: "Configure platform preferences",
    },
  },
];

// Sorted once by specificity (longest match first) so nested routes
// like /admin/settings/change-password always win over /admin/settings,
// regardless of the order entries are declared in ADMIN_PAGES above.
const SORTED_ADMIN_PAGES = [...ADMIN_PAGES].sort(
  (a, b) => b.match.length - a.match.length,
);

function getCurrentPage(pathname: string): PageInfo {
  const current = SORTED_ADMIN_PAGES.find(
    ({ match }) => pathname === match || pathname.startsWith(`${match}/`),
  );

  return (
    current?.page ?? {
      title: "Admin",
      description: "Platform administration",
    }
  );
}

function getInitials(name: string | null) {
  if (!name) return "A";

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading } = useLogout();

  const profileRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [adminName, setAdminName] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);

  const page = getCurrentPage(location.pathname);
  const initials = getInitials(adminName);

  useEffect(() => {
    const name =
      localStorage.getItem("userFullName") || localStorage.getItem("adminName");

    const email =
      localStorage.getItem("userEmail") || localStorage.getItem("adminEmail");

    const avatar =
      localStorage.getItem("profileImage") ||
      localStorage.getItem("adminAvatar");

    setAdminName(name);
    setAdminEmail(email);
    setAdminAvatar(avatar);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const drawer = drawerRef.current;
    const focusables = drawer?.querySelectorAll<HTMLElement>(
      'button, a[href], input, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
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
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 w-full",
          "border-b transition-all duration-200",
          scrolled
            ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-slate-200/70 bg-white/90 backdrop-blur-lg",
        )}
      >
        <div
          className="
            flex min-h-16
            items-center justify-between
            gap-3
            px-3
            min-[375px]:px-4
            sm:px-6
            lg:min-h-18
            lg:px-8
          "
        >
          {/* Left: mobile menu + page information */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Toggle admin navigation"
              aria-expanded={mobileMenuOpen}
              className={cn(
                "relative flex size-9 shrink-0 items-center justify-center rounded-lg lg:hidden",
                "border border-slate-200 transition-all duration-200 hover:bg-slate-50",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                mobileMenuOpen && "border-slate-300 bg-slate-100",
              )}
            >
              <span
                className={cn(
                  "absolute transition-all duration-200",
                  mobileMenuOpen ? "rotate-45 opacity-0" : "opacity-100",
                )}
              >
                <Menu size={18} className="text-slate-700" />
              </span>
              <span
                className={cn(
                  "absolute transition-all duration-200",
                  mobileMenuOpen ? "opacity-100" : "-rotate-45 opacity-0",
                )}
              >
                <X size={18} className="text-slate-700" />
              </span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1
                  className="
                    truncate
                    text-base font-bold
                    tracking-tight text-slate-900
                    sm:text-lg
                    lg:text-xl
                  "
                >
                  {page.title}
                </h1>

                <span
                  className="
                    hidden
                    items-center gap-1
                    rounded-full
                    border border-indigo-100
                    bg-indigo-50
                    px-2 py-1
                    text-[10px] font-bold
                    uppercase tracking-wide
                    text-indigo-700
                    sm:inline-flex
                  "
                >
                  <ShieldCheck size={11} />
                  Admin
                </span>
              </div>

              {page.description && (
                <p
                  className="
                    mt-0.5
                    hidden truncate
                    text-xs text-slate-500
                    sm:block
                    lg:text-[13px]
                  "
                >
                  {page.description}
                </p>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Admin workspace indicator */}
            <div
              className="
                hidden
                items-center gap-2
                rounded-xl
                border border-slate-200
                bg-slate-50/80
                px-3 py-2
                xl:flex
              "
            >
              <div
                className="
                  flex size-7
                  items-center justify-center
                  rounded-lg
                  bg-indigo-100
                  text-indigo-600
                "
              >
                <ShieldCheck size={14} />
              </div>

              <div className="leading-tight">
                <p className="text-[11px] font-semibold text-slate-700">
                  Admin Workspace
                </p>
                <p className="text-[10px] text-slate-400">
                  Platform management
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-7 w-px bg-slate-200 xl:block" />

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((previous) => !previous)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className={cn(
                  "flex items-center",
                  "rounded-xl border",
                  "transition-all duration-200",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-indigo-500",
                  "focus-visible:ring-offset-2",
                  profileOpen
                    ? "border-indigo-200 bg-indigo-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  "p-1 sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-2.5",
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="size-8 sm:size-9">
                    {adminAvatar && (
                      <AvatarImage
                        src={adminAvatar}
                        alt={adminName ?? "Admin"}
                      />
                    )}

                    <AvatarFallback
                      className="
                        bg-linear-to-br
                        from-indigo-500
                        to-purple-600
                        text-[10px]
                        font-bold text-white
                        sm:text-xs
                      "
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <span
                    className="
                      absolute
                      -bottom-0.5 -right-0.5
                      size-2.5
                      rounded-full
                      border-2 border-white
                      bg-emerald-400
                    "
                  />
                </div>

                <div className="hidden min-w-0 text-left md:block">
                  <p
                    className="
                      max-w-32 truncate
                      text-xs font-semibold
                      leading-tight text-slate-900
                      lg:text-sm
                    "
                  >
                    {adminName || "Admin User"}
                  </p>

                  <p
                    className="
                      mt-0.5
                      max-w-36 truncate
                      text-[10px]
                      leading-tight
                      text-slate-500
                      lg:text-[11px]
                    "
                  >
                    Administrator
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className={cn(
                    "hidden shrink-0 text-slate-400",
                    "transition-transform duration-200",
                    "md:block",
                    profileOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div
                  role="menu"
                  className="
                    absolute right-0
                    top-[calc(100%+8px)]
                    z-50
                    w-[calc(100vw-24px)]
                    max-w-70
                    overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    shadow-xl
                    shadow-slate-900/10
                    animate-in
                    fade-in
                    slide-in-from-top-2
                    duration-150
                  "
                >
                  {/* Account information */}
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11 shrink-0">
                        {adminAvatar && (
                          <AvatarImage
                            src={adminAvatar}
                            alt={adminName ?? "Admin"}
                          />
                        )}

                        <AvatarFallback
                          className="
                            bg-linear-to-br
                            from-indigo-500
                            to-purple-600
                            text-sm
                            font-bold text-white
                          "
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {adminName || "Admin User"}
                          </p>

                          <ShieldCheck
                            size={14}
                            className="shrink-0 text-indigo-500"
                          />
                        </div>

                        {adminEmail && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {adminEmail}
                          </p>
                        )}

                        <span
                          className="
                            mt-1.5
                            inline-flex
                            items-center
                            rounded-full
                            bg-indigo-50
                            px-2 py-0.5
                            text-[10px]
                            font-semibold
                            text-indigo-700
                            ring-1 ring-indigo-100
                          "
                        >
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Navigation */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setProfileOpen(false);
                      }}
                      className="
                        flex h-11 w-full
                        items-center gap-3
                        rounded-xl
                        px-3
                        text-left text-sm
                        font-medium text-slate-700
                        transition-colors
                        hover:bg-slate-50
                      "
                    >
                      <LayoutGrid size={17} className="text-slate-400" />
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate("/admin/settings");
                        setProfileOpen(false);
                      }}
                      className="
                        flex h-11 w-full
                        items-center gap-3
                        rounded-xl
                        px-3
                        text-left text-sm
                        font-medium text-slate-700
                        transition-colors
                        hover:bg-slate-50
                      "
                    >
                      <Settings size={17} className="text-slate-400" />
                      Settings
                    </button>

                    {/* Optional account/profile item.
                        Remove this if admin has no profile page. */}
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/admin/settings");
                        setProfileOpen(false);
                      }}
                      className="
                        flex h-11 w-full
                        items-center gap-3
                        rounded-xl
                        px-3
                        text-left text-sm
                        font-medium text-slate-700
                        transition-colors
                        hover:bg-slate-50
                      "
                    >
                      <UserRound size={17} className="text-slate-400" />
                      Account
                    </button>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Logout */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="
                        flex h-11 w-full
                        items-center gap-3
                        rounded-xl
                        px-3
                        text-left text-sm
                        font-semibold text-red-600
                        transition-colors
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      <LogOut size={17} />
                      {isLoading ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Admin navigation menu"
        >
          <div
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div
            ref={drawerRef}
            className="
              absolute left-0 top-0
              flex h-full w-[86vw] max-w-80
              flex-col overflow-hidden
              rounded-r-3xl bg-white
              shadow-2xl shadow-slate-900/20
              animate-in fade-in zoom-in-95 slide-in-from-left duration-300 ease-out
            "
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
              <span className="flex items-center gap-2">
                <div
                  style={{
                    clipPath:
                      "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  }}
                  className="
                    flex size-8 shrink-0
                    items-center justify-center
                    bg-linear-to-br from-indigo-500 to-purple-600
                    shadow-md shadow-indigo-500/20
                  "
                >
                  <Check className="size-4 text-white" strokeWidth={3} />
                </div>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-base font-bold tracking-tight text-slate-900">
                    Recruit
                    <span className="bg-linear-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                      Flow
                    </span>
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium tracking-wider text-slate-400">
                    Admin Console
                  </span>
                </span>
              </span>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex size-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-5">
              <button
                type="button"
                onClick={() => {
                  navigate("/admin/settings");
                  setMobileMenuOpen(false);
                }}
                className="
                  mb-5 flex w-full items-center gap-3.5
                  rounded-2xl border border-transparent
                  bg-linear-to-br from-indigo-500 to-purple-600
                  p-4 text-left shadow-sm
                "
              >
                <div className="relative shrink-0">
                  <Avatar className="size-12 ring-2 ring-white/40">
                    {adminAvatar && (
                      <AvatarImage
                        src={adminAvatar}
                        alt={adminName ?? "Admin"}
                      />
                    )}
                    <AvatarFallback className="bg-white/20 text-base font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-white bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {adminName || "Admin User"}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Administrator
                  </span>
                  {adminEmail && (
                    <p className="mt-1 truncate text-xs text-white/80">
                      {adminEmail}
                    </p>
                  )}
                </div>
              </button>

              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Platform
              </p>
              <nav className="space-y-1">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active =
                    location.pathname === item.href ||
                    location.pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl border-l-4 py-3 pl-4 pr-3 transition-all duration-200",
                        active
                          ? "border-l-indigo-600 bg-indigo-50 font-semibold text-indigo-700"
                          : "border-l-transparent font-medium text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          ICON_BG[item.iconColor],
                        )}
                      >
                        <Icon size={16} />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="shrink-0 border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-red-600 transition-colors hover:bg-red-50/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <LogOut size={16} />
                </span>
                {isLoading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
