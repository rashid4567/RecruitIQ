import { useEffect, useState } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Loader2,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import Sidebar from "../pages/components/layout/Sidebar";
import Header from "../../../../pages/landing/sections/Header";
import { RecruiterProfileSection } from "./components/Recruiter-profile/ProfileSection";
import { NotificationsSection } from "./profileSeting/NotificationsSection";
import { BillingSection } from "./profileSeting/BillingSection";
import { GetRecruiterProfileUc } from "../di/recruiter.di";
import type { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";
import { SecuritySection } from "./components/SecuritySection/SecuritySection";

const settingsTabs = [
  {
    value: "profile",
    label: "Profile",
    icon: User,
    description: "Personal info, company details, logo and contact",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    value: "security",
    label: "Security",
    icon: Shield,
    description: "Password, 2FA, sessions and login methods",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Email, in-app, job alerts and marketing",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    value: "billing",
    label: "Billing & Plan",
    icon: CreditCard,
    description: "Plan, payment methods, invoices and usage",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
] as const;

type TabValue = (typeof settingsTabs)[number]["value"];

export default function RecruiterSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("profile");
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await GetRecruiterProfileUc.execute();
      setProfile(data);
    } catch {
      toast.error("Failed to load recruiter profile");
    } finally {
      setLoading(false);
    }
  };

  const activeTabMeta = settingsTabs.find((t) => t.value === activeTab)!;
  const ActiveIcon = activeTabMeta.icon;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Loading settings…
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Couldn't load profile
          </h3>
          <p className="text-sm text-slate-500 mb-5">
            Please check your connection and try again.
          </p>
          <button
            onClick={loadProfile}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar activeItem="profile" />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
            {/* Title row */}
            <div className="flex items-center gap-3 px-8 pt-5 pb-2">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Settings className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <h1 className="text-[17px] font-bold text-slate-900 leading-none">
                  Settings
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage your account, security and subscription preferences
                </p>
              </div>
            </div>

            {/* Tab strip */}
            <div className="flex items-end gap-0.5 px-6 overflow-x-auto scrollbar-none">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "group relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-150 rounded-t-xl border-b-2 -mb-px whitespace-nowrap shrink-0",
                      active
                        ? "border-indigo-600 text-indigo-700 bg-indigo-50/70"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50",
                    )}
                  >
                    {/* Icon badge */}
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0",
                        active
                          ? tab.bg
                          : "bg-slate-100 group-hover:bg-slate-200",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          active ? tab.color : "text-slate-400",
                        )}
                      />
                    </div>
                    <span className={cn(active ? "font-semibold" : "")}>
                      {tab.label}
                    </span>

                    {/* Active dot indicator */}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-7 max-w-6xl">
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                    activeTabMeta.bg,
                  )}
                >
                  <ActiveIcon className={cn("h-5 w-5", activeTabMeta.color)} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-none">
                    {activeTabMeta.label}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {activeTabMeta.description}
                  </p>
                </div>
              </div>

              {/* Content card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="p-8 lg:p-10">
                  {activeTab === "profile" && <RecruiterProfileSection />}
                  {activeTab === "security" && <SecuritySection />}
                  {activeTab === "notifications" && <NotificationsSection />}
                  {activeTab === "billing" && <BillingSection />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
