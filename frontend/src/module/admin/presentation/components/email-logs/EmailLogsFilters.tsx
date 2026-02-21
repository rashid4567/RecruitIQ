import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  return (
    <Card className="border-slate-200/70 shadow-sm sticky top-20">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-indigo-600" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-6 text-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <Input
              placeholder="Recipient or subject..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 pl-11 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 rounded-lg"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Status
          </label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Type
          </label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="TEST">Test</SelectItem>
              <SelectItem value="REAL">Real</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-10 mt-2"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}