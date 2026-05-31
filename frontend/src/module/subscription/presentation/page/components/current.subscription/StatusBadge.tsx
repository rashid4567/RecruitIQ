interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
      <span className="text-sm font-semibold text-emerald-700">{status}</span>
    </div>
  );
}
