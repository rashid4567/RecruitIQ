import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export function SectionCard({
  title,
  icon,
  children,
  defaultOpen = true,
  collapsible = false,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <button
        className={`w-full flex items-center justify-between px-6 py-4 ${
          collapsible ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"
        } transition-colors`}
        onClick={() => collapsible && setOpen((p) => !p)}
        disabled={!collapsible}
      >
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          {title}
        </h2>
        {collapsible && (
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-slate-50">{children}</div>
      )}
    </div>
  );
}