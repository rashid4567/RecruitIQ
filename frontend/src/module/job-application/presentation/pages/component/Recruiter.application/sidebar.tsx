
import {
  LayoutGrid,
  Briefcase,
  Users,
  Calendar,
  PhoneOff,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";
import { NavItem } from "./Navitem";
export function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-base text-slate-900 tracking-tight">
            RecruitIQ
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <NavItem icon={<LayoutGrid size={16} />} label="Dashboard" active={false} />
        <NavItem icon={<Briefcase size={16} />} label="Jobs" active={true} />
        <NavItem icon={<Users size={16} />} label="Applications" active={false} />
        <NavItem icon={<Calendar size={16} />} label="Interviews" active={false} />
        <NavItem icon={<PhoneOff size={16} />} label="Candidates" active={false} />
        <NavItem icon={<CreditCard size={16} />} label="Billing" active={false} />
        <NavItem icon={<User size={16} />} label="Profile" active={false} />
      </nav>

      <div className="px-3 py-4 border-t border-slate-200">
        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm w-full px-3 py-2 rounded-lg hover:bg-slate-100 transition">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}