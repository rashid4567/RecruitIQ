import { Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function JobPostHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md shadow-indigo-500/20">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Job Posts
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage and moderate all job listings
            </p>
          </div>
        </div>
        <Avatar className="w-9 h-9 ring-2 ring-indigo-100">
          <AvatarFallback className="bg-linear-to-br from-indigo-600 to-violet-600 text-white text-xs font-bold">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}