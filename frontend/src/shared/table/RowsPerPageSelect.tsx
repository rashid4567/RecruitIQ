interface RowsPerPageSelectProps {
  value: number;
  onChange: (limit: number) => void;
  options?: number[];
}

export function RowsPerPageSelect({
  value,
  onChange,
  options = [10, 20, 50, 100],
}: RowsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <span>Rows per page:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 px-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}