import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Zap,
  Sparkles,
  FileText,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "@/module/auth/hooks/useLogout";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    path: "/recruiter/dashboard",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    id: "jobs",
    path: "/recruiter/jobs",
  },
  {
    icon: FileText,
    label: "Applications",
    id: "applications",
    path: "/recruiter/applications",
  },
  {
    icon: Calendar,
    label: "Interviews",
    id: "interviews",
    path: "/recruiter/interviews",
  },
  {
    icon: CreditCard,
    label: "Billing",
    id: "billing",
    path: "/recruiter/plans",
  },
  {
    icon: User,
    label: "Profile",
    id: "profile",
    path: "/recruiter/profile",
  },
];

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (item: (typeof navItems)[0]) => {
    if (activeItem) return activeItem === item.id;
    return location.pathname.startsWith(item.path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Lock body scroll while the mobile/tablet drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile / tablet top bar with hamburger trigger (<1024px) */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 h-14 bg-white border-b border-slate-100 shadow-sm">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="app-sidebar"
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[15px] text-slate-900 tracking-tight">
            Recruit-IQ
          </span>
        </div>
      </div>

      {/* Overlay (mobile / tablet only) */}
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-250 ease-out lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        id="app-sidebar"
        role="navigation"
        aria-label="Main"
        className={cn(
          "w-64 lg:w-64 xl:w-72 bg-white border-r border-slate-100 flex flex-col h-screen shadow-md",
          // Fixed + slide-in drawer below lg, fixed permanent sidebar at lg+
          "fixed top-0 left-0 z-50 transition-transform duration-250 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:z-30",
        )}
      >
        <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavigate("/recruiter/dashboard")}
            className="flex items-center gap-3 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-bold text-[17px] text-slate-900 tracking-tight">
                Recruit-IQ
              </span>
              <p className="text-[9px] text-slate-400 font-semibold tracking-[0.12em] uppercase mt-px">
                AI Recruiting
              </p>
            </div>
          </button>

          {/* Close button, drawer mode only */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative w-full flex items-center justify-between px-4 py-3 min-h-11 text-sm font-medium rounded-xl",
                  "transition-all duration-200 ease-in-out group",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {/* Active left indicator */}
                <span
                  className={cn(
                    "absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600 transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200",
                      active
                        ? "bg-indigo-100"
                        : "bg-slate-100 group-hover:bg-slate-200",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        active ? "text-indigo-600" : "text-slate-500",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "transition-colors duration-200",
                      active ? "text-indigo-700 font-semibold" : "",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-3 mt-auto">
          <div className="bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span className="text-sm font-semibold">Upgrade to Pro</span>
            </div>

            <p className="text-[11px] text-indigo-200 mb-3 leading-relaxed">
              Unlock AI-powered candidate matching &amp; priority support
            </p>

            <Button
              size="sm"
              className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs h-8 shadow-sm transition-colors duration-200"
              onClick={() => handleNavigate("/recruiter/plans")}
            >
              Upgrade Now
            </Button>
          </div>
        </div>

        <div className="px-3 pb-4 pt-1 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-red-600 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 ease-in-out text-sm font-medium hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 flex items-center justify-center transition-colors duration-200">
              <LogOut className="w-4 h-4" />
            </div>
            Logout
          </button>
        </div>
      </aside>
      <div className="hidden lg:block lg:w-64 xl:w-72 shrink-0" aria-hidden="true" />
    </>
  );
}