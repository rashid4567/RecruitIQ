// components/profile/sections/SectionHeader.tsx
import React from 'react';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function SectionHeader({ 
  icon, 
  title, 
  iconBgColor = "bg-blue-100", 
  iconColor = "text-blue-600" 
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-8 w-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
        <div className={`h-4 w-4 ${iconColor}`}>{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </div>
  );
}