"use client";

interface SettingsTabsProps {
  tabs: Array<{ id: string; icon: any }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SettingsTabs({ tabs, activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl p-1.5 inline-flex mb-8 border border-gray-200/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-lg shadow-gray-200/50 border border-gray-200/30"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.id}
          </button>
        );
      })}
    </div>
  );
}