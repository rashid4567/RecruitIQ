import { Activity, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityLogsHeaderProps {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export function ActivityLogsHeader({
  loading,
  refreshing,
  onRefresh,
}: ActivityLogsHeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/70 sticky top-0 z-40 px-6 py-4 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Activity Logs
            </h1>
            <p className="text-sm text-slate-500">
              Real-time system & user activity monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3"
            onClick={onRefresh}
            disabled={refreshing || loading}
          >
            {refreshing || loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1.5 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            size="sm"
            className="h-9 bg-indigo-600 hover:bg-indigo-700 gap-1.5 shadow-sm"
            disabled
          >
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
