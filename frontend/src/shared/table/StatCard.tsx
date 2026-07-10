import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  sub?: string;
  subColor?: string;
}

export function StatCard({ label, value, icon, iconBg, iconColor, sub, subColor = "text-gray-400" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{label}</p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
          {sub && <p className={`text-xs font-medium mt-1 ${subColor}`}>{sub}</p>}
        </div>
        <div className={`w-10 h-10 ${iconBg} border rounded-xl flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}