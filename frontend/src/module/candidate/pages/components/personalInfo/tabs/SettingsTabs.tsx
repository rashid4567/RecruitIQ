

import type { LucideIcon } from "lucide-react";
import type { SettingsTab } from "@/module/candidate/constants/settingTab";

export interface SettingsTabsProps {
  tabs: Array<{ id: SettingsTab; icon: LucideIcon }>;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabs({
  tabs,
  activeTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div 
      role="tablist" 
      className="bg-gray-100/50 backdrop-blur-sm rounded-xl p-1.5 inline-flex mb-8 border"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id.toLowerCase().replace(/\s+/g, '-')}-panel`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-md border border-gray-200"
                : "text-gray-600 hover:bg-white/70 hover:text-gray-900"
            }`}
          >
            <Icon className={`h-4 w-4 ${activeTab === tab.id ? "text-blue-600" : ""}`} />
            <span>{tab.id}</span>
          </button>
        );
      })}
    </div>
  );
}