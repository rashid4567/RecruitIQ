import { Search, X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface EmailLogsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export function EmailLogsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onClearFilters,
}: EmailLogsFiltersProps) {
  const hasActiveFilters = search.trim() || statusFilter !== "ALL" || typeFilter !== "ALL";

  return (
    <div className="sticky top-[97px] z-40 bg-white border-b border-slate-200 px-6 py-5 shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by recipient, subject or email..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-12 pl-12 pr-12 bg-slate-50 border-slate-200 focus:border-indigo-500 rounded-2xl text-base"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Status & Type Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-12 w-52 bg-slate-50 border-slate-200 rounded-2xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="SENT">✅ Sent Successfully</SelectItem>
                <SelectItem value="FAILED">❌ Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="h-12 w-52 bg-slate-50 border-slate-200 rounded-2xl">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="TEST">🧪 Test Email</SelectItem>
                <SelectItem value="REAL">📧 Production Email</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="h-12 px-6 flex items-center gap-2 hover:text-red-600"
              >
                <RotateCw className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {search && (
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                "{search}"
                <X className="ml-2 h-4 w-4 cursor-pointer" onClick={() => onSearchChange("")} />
              </Badge>
            )}
            {statusFilter !== "ALL" && (
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {statusFilter === "SENT" ? "✅ Sent" : "❌ Failed"}
                <X className="ml-2 h-4 w-4 cursor-pointer" onClick={() => onStatusFilterChange("ALL")} />
              </Badge>
            )}
            {typeFilter !== "ALL" && (
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {typeFilter === "TEST" ? "🧪 Test" : "📧 Production"}
                <X className="ml-2 h-4 w-4 cursor-pointer" onClick={() => onTypeFilterChange("ALL")} />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}