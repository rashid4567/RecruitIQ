interface ScoreBarProps {
  label: string;
  value: number;
  fill?: string;
}

export function ScoreBar({
  label,
  value,
  fill = "bg-indigo-500",
}: ScoreBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${fill}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}