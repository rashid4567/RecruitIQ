import { Activity, AlertCircle, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityLogsStatsProps {
  total: number;
  errors: number;
  today: number;
  mostRecentUser: string;
}

export function ActivityLogsStats({
  total,
  errors,
  today,
  mostRecentUser,
}: ActivityLogsStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Events</p>
              <p className="text-3xl font-bold mt-1.5">{total}</p>
            </div>
            <Activity className="h-8 w-8 text-indigo-500/70" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Errors</p>
              <p className="text-3xl font-bold mt-1.5 text-rose-600">{errors}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-rose-500/70" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Today</p>
              <p className="text-3xl font-bold mt-1.5">{today}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500/70" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-slate-500 font-medium">Most Recent</p>
              <p className="text-xl font-semibold mt-1.5 truncate">
                {mostRecentUser}
              </p>
            </div>
            <User className="h-8 w-8 text-slate-500/70 shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}