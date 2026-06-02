import { Progress } from "@/components/ui/progress";

interface UsageMetricRowProps {
  label: string;
  used: number;
  limit: number;
  colorClass: string;
  progressBgClass: string;
  unit: string;
}

function calcPercentage(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return (used / limit) * 100;
}

export function UsageMetricRow({
  label,
  used,
  limit,
  colorClass,
  progressBgClass,
  unit,
}: UsageMetricRowProps) {
  const percentage = calcPercentage(used, limit);
  const remaining = limit - used;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className={`text-sm font-bold ${colorClass}`}>
            {used}/{limit}
          </span>
        </div>
        <Progress value={percentage} className={`h-2 ${progressBgClass}`} />
      </div>
      <div className="text-sm text-slate-600">
        {remaining} {unit} remaining
      </div>
    </div>
  );
}