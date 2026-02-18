import { useState, useCallback } from "react";

export type SettingsTab = "Personal Info" | "Security" | "Notifications" | "Privacy";

export function useSettingsTab(initialTab: SettingsTab = "Personal Info") {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  const switchTab = useCallback((tab: SettingsTab) => {
    setActiveTab(tab);
  }, []);

  const isActive = useCallback((tab: SettingsTab) => {
    return activeTab === tab;
  }, [activeTab]);

  const getTabIndex = useCallback((tab: SettingsTab) => {
    const tabs: SettingsTab[] = ["Personal Info", "Security", "Notifications", "Privacy"];
    return tabs.indexOf(tab);
  }, []);

  const nextTab = useCallback(() => {
    const tabs: SettingsTab[] = ["Personal Info", "Security", "Notifications", "Privacy"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  }, [activeTab]);

  const previousTab = useCallback(() => {
    const tabs: SettingsTab[] = ["Personal Info", "Security", "Notifications", "Privacy"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    switchTab,
    isActive,
    getTabIndex,
    nextTab,
    previousTab,
  };
}