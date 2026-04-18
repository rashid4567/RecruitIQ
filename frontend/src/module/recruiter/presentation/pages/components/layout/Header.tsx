import { Search, Bell, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <a href="/jobs" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5" /> Back to Jobs
        </a>
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold text-gray-900">Create New Job</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search..." className="w-64 pl-9 bg-gray-50" />
        </div>
        <button className="p-2.5 hover:bg-gray-100 rounded-xl relative">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">Rashid Khan</p>
            <p className="text-xs text-gray-500">Talent Lead</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face"
            alt="Profile"
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100"
          />
        </div>
      </div>
    </header>
  );
}