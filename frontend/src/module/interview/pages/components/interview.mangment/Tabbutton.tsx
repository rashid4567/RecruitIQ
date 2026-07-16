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
      className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      }`}
    >
      {Icon && <Icon size={14} />}
      {label}
      {count !== undefined && (
        <span
          className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
            active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}