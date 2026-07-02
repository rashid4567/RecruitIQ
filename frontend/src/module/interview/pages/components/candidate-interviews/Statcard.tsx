import React from "react";

export interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: number;
  hint: string;
  badge?: boolean;
}

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  hint,
  badge,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex items-center gap-3.5">
      <div
        className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-2xl font-bold text-slate-900 leading-none">
            {value}
          </p>
          {badge && (
            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide">
              Action
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-slate-600 mt-1 truncate">
          {label}
        </p>
        <p className="text-[11px] text-slate-400 truncate">{hint}</p>
      </div>
    </div>
  );
}