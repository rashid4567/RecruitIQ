import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  UserCircle,
  CreditCard,
  User,
  LogOut,
  Zap,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    path: "/recruiter/dashboard",
  },
  { icon: Briefcase, label: "Jobs", id: "jobs", path: "/recruiter/jobs" },
  {
    icon: Users,
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
    icon: MessageSquare,
    label: "Interview Chats",
    id: "interview-chats",
    path: "/recruiter/chats",
  },
  {
    icon: UserCircle,
    label: "Candidates",
    id: "candidates",
    path: "/recruiter/candidates",
  },
  {
    icon: CreditCard,
    label: "Billing",
    id: "billing",
    path: "/recruiter/plans",
  },
  { icon: User, label: "Profile", id: "profile", path: "/recruiter/profile" },
];

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: (typeof navItems)[0]) => {
    if (activeItem) return activeItem === item.id;
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-bold text-[17px] text-slate-900 tracking-tight">
              Recruit-IQ
            </span>
            <p className="text-[9px] text-slate-400 font-semibold tracking-[0.12em] uppercase mt-px">
              AI Recruiting
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 group",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    active
                      ? "bg-indigo-100"
                      : "bg-slate-100 group-hover:bg-slate-200",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4",
                      active ? "text-indigo-600" : "text-slate-500",
                    )}
                  />
                </div>
                <span className={active ? "text-indigo-700 font-semibold" : ""}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
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
            className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs h-8 shadow-sm"
            onClick={() => navigate("/recruiter/plans")}
          >
            Upgrade Now
          </Button>
        </div>
      </div>

      <div className="px-3 pb-4 pt-1 border-t border-slate-100">
        <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm font-medium">
          <div className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 flex items-center justify-center transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          Logout
        </button>
      </div>
    </aside>
  );
}
