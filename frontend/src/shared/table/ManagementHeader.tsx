import { Users, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ManagementHeaderProps {
  title: string;
  description: string;
  onRefresh: () => void;
  loading?: boolean;
  onExport?: () => void;
}

export function ManagementHeader({
  title,
  description,
  onRefresh,
  loading = false,
  onExport,
}: ManagementHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/70 sticky top-0 z-40 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            size="sm"
            className="h-9 px-3 text-sm bg-indigo-600 hover:bg-indigo-700 gap-1.5"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </header>
  );
}