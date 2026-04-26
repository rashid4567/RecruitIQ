

import { LayoutDashboard, Briefcase, Users, Calendar, MessageSquare, UserCircle, CreditCard, User, LogOut, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Briefcase, label: "Jobs", id: "jobs",  },
  { icon: Users, label: "Applications", id: "applications", badge: 48 },
  { icon: Calendar, label: "Interviews", id: "interviews" },
  { icon: MessageSquare, label: "Interview Chats", id: "interview-chats" },
  { icon: UserCircle, label: "Candidates", id: "candidates" },
  { icon: CreditCard, label: "Billing", id: "billing" },
  { icon: User, label: "Profile", id: "profile" },
];

export default function Sidebar({ activeItem = "jobs" }: { activeItem?: string }) {
  return (
<aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen fixed shadow-xl mt-8">
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-gray-900">Recruit-IQ</span>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider">AI RECRUITING</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all",
              activeItem === item.id ? "bg-linear-to-r from-indigo-50 to-violet-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-5 h-5", activeItem === item.id ? "text-indigo-600" : "text-gray-400")} />
              <span>{item.label}</span>
            </div>
            {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
          </button>
        ))}
      </nav>

      {/* Upgrade Card */}
      <div className="p-4">
        <div className="bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-indigo-100 mb-3">Unlock AI-powered candidate matching</p>
          <Button size="sm" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">Upgrade Now</Button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 text-gray-500 hover:text-red-600 w-full px-4 py-3 rounded-xl hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}