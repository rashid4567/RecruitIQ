import { Mail, RefreshCw, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailLogsHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function EmailLogsHeader({ onRefresh, isRefreshing }: EmailLogsHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-6 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Email Logs</h1>
            <p className="text-sm text-slate-500 mt-1">Track and monitor all outgoing system emails</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </header>
  );
}