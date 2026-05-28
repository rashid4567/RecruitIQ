import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ActivityLogsSearchProps {
  search: string;
  onSearch: (value: string) => void;
}

export function ActivityLogsSearch({
  search,
  onSearch,
}: ActivityLogsSearchProps) {
  return (
    <div className="relative max-w-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        placeholder="Search users, actions, descriptions..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="h-11 pl-11 pr-12 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400 rounded-xl"
      />
      {search && (
        <button
          onClick={() => onSearch("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
