import { useState, useCallback } from "react";
import { type SettingsTab, SETTINGS_TABS } from "../constants/settingTab";

export function useSettingsTab(initialTab: SettingsTab = "Personal Info") {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  const switchTab = useCallback((tab: SettingsTab) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    switchTab,
    tabs: SETTINGS_TABS,
  };
}