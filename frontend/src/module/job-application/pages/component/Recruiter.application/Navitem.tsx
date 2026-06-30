import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

export function NavItem({ icon, label, active }: NavItemProps) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-sm transition ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
