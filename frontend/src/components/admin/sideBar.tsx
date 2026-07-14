import { useLogout } from "@/module/auth/hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutGrid,
  FileText,
  Users,
  UsersRound,
  Users2,
  CheckCircle2,
  Mail,
  MailIcon,
  Settings,
  LogOut,
  Briefcase,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  exact?: boolean;
  badge?: number;
}

// Flat list — no more General / Management / System groupings.
const menuItems: MenuItem[] = [
  { icon: LayoutGrid, label: "Dashboard", href: "/admin/dashboard", exact: true },
  { icon: FileText, label: "Activity Logs", href: "/admin/activity-logs" },
  { icon: Users, label: "Recruiter Management", href: "/admin/recruiters" },
  { icon: UsersRound, label: "Candidate Management", href: "/admin/candidates" },
  { icon: Briefcase, label: "JobPost Management", href: "/admin/jobPosts" },
  { icon: Users2, label: "Subscribers", href: "/admin/subscribers" },
  { icon: CheckCircle2, label: "Plans Overview", href: "/admin/plans" },
  { icon: Mail, label: "Email Template Management", href: "/admin/email-templates" },
  { icon: MailIcon, label: "Email Logs", href: "/admin/email-logs" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading } = useLogout();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: MenuItem) => {
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setMobileOpen(false);
    }
  };

  const renderNavBody = (isCollapsed: boolean) => (
    // min-h-0 is the fix: without it, this flex child refuses to shrink,
    // overflow-y-auto never kicks in, and the logout footer gets pushed
    // out of view below the viewport whenever the menu list is tall.
    <div className="flex flex-col h-full min-h-0">
      <nav className="flex-1 min-h-0 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              aria-current={active ? "page" : undefined}
              title={isCollapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 mb-1 group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                active
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  : "text-gray-700 hover:bg-slate-100 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="relative shrink-0">
                <Icon
                  size={20}
                  className={
                    active
                      ? "text-indigo-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }
                />
                {isCollapsed && active && (
                  <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-full" />
                )}
              </div>

              <span
                className={`text-sm font-medium truncate transition-[opacity,max-width] duration-200 ${
                  isCollapsed
                    ? "opacity-0 max-w-0 overflow-hidden"
                    : "opacity-100 max-w-45"
                } ${active ? "font-semibold" : ""}`}
              >
                {item.label}
              </span>

              {!!item.badge && !isCollapsed && (
                <span className="ml-auto text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}

              {active && !isCollapsed && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* shrink-0 keeps this footer pinned and fully visible, never squeezed by nav content */}
      <div className="shrink-0 border-t border-gray-200 px-3 py-3">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg bg-gray-50 hover:shadow-sm transition-shadow">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@recruitiq.com
                </p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="ghost"
              className="flex items-center gap-3 px-3 py-2.5 text-red-600 bg-red-50/60 hover:bg-red-100 border border-red-100 rounded-lg transition-colors w-full group justify-start"
            >
              <LogOut
                size={18}
                className="text-red-600 transition-transform group-hover:scale-105 shrink-0"
              />
              <span className="text-sm font-semibold">
                {isLoading ? "Logging out..." : "Log Out"}
              </span>
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="p-2.5 text-red-600 bg-red-50/60 hover:bg-red-100 border border-red-100 rounded-lg transition-colors group w-full flex justify-center"
              title="Log Out"
              aria-label="Log out"
            >
              <LogOut size={18} className="text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`hidden lg:flex ${collapsed ? "w-20" : "w-64 xl:w-72"} bg-white border-r border-gray-200 flex-col h-screen transition-[width] duration-300 ease-in-out sticky top-0 shrink-0`}
      >
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <button
            className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md`}
            onClick={() => handleNavigation("/admin/dashboard")}
            aria-label="Go to dashboard"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-gray-900 truncate">
                RecruitIQ Admin
              </span>
            )}
          </button>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Collapse sidebar"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-2 p-1 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0"
            aria-label="Expand sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-500 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {renderNavBody(collapsed)}
      </div>

      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Open navigation menu"
              >
                <Menu size={22} className="text-gray-700" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetHeader className="px-4 py-4 border-b border-gray-200 text-left shrink-0">
                <SheetTitle asChild>
                  <button
                    className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
                    onClick={() => handleNavigation("/admin/dashboard")}
                  >
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">
                      RecruitIQ Admin
                    </span>
                  </button>
                </SheetTitle>
              </SheetHeader>

              {renderNavBody(false)}
            </SheetContent>
          </Sheet>

          <span className="font-semibold text-gray-900">RecruitIQ Admin</span>
        </div>

        <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          A
        </div>
      </header>
    </>
  );
}