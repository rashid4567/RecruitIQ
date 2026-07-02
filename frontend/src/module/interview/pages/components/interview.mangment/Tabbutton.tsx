import type { ComponentType } from "react";

export default function TabButton({
  label,
  active,
  onClick,
  count,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
  icon?: ComponentType<{ size: number }>;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {Icon && <Icon size={15} />}
      {label}
      {count !== undefined && (
        <span
          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            active ? "bg-slate-100 text-slate-700" : "bg-slate-200/40"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}