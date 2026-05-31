import { AlertCircle } from "lucide-react";

interface UsageCardProps {
  title: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
  linear: string;
  description?: string;
}

export default function UsageCard({
  title,
  used,
  limit,
  icon,
  linear,
  description,
}: UsageCardProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage > 80;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 transition-all hover:shadow-lg hover:shadow-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-linear-to-br ${linear}`}>{icon}</div>
        {isNearLimit && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
              Warning
            </span>
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-slate-900">{used}</span>
          <span className="text-slate-500">/ {limit}</span>
        </div>
        {description && <p className="text-xs text-slate-600">{description}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">{percentage.toFixed(0)}% used</span>
          <span
            className={`font-semibold ${isNearLimit ? "text-amber-700" : "text-slate-700"}`}
          >
            {limit - used} remaining
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isNearLimit
                ? "bg-linear-to-r from-amber-500 to-orange-500"
                : "bg-linear-to-r from-blue-600 to-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
