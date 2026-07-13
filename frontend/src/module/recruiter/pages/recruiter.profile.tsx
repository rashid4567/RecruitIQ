import { useEffect, useState } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Loader2,
  Settings,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import Sidebar from "./components/layout/Sidebar";
import Header from "../../../pages/landing/sections/Header";
import { RecruiterProfileSection } from "./components/Recruiter-profile/ProfileSection";
import { NotificationsSection } from "./components/profileSeting/NotificationsSection";
import { BillingSection } from "./components/profileSeting/BillingSection";
import { getRecruiterProfile } from "../api/recruiter.api";
import type { RecruiterProfile } from "../types/recruiter.types";
import { SecuritySection } from "./components/SecuritySection/SecuritySection";

const settingsTabs = [
  {
    value: "profile",
    label: "Profile",
    icon: User,
    description: "Personal info, company details, logo and contact",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    activeBorder: "border-indigo-500",
    activeText: "text-indigo-700",
    activeBg: "bg-indigo-50/70",
    dot: "bg-indigo-500",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    value: "security",
    label: "Security",
    icon: Shield,
    description: "Password, 2FA, sessions and login methods",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    activeBorder: "border-emerald-500",
    activeText: "text-emerald-700",
    activeBg: "bg-emerald-50/70",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Email, in-app, job alerts and marketing",
    color: "text-amber-600",
    bg: "bg-amber-50",
    activeBorder: "border-amber-500",
    activeText: "text-amber-700",
    activeBg: "bg-amber-50/70",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    value: "billing",
    label: "Billing & Plan",
    icon: CreditCard,
    description: "Plan, payment methods, invoices and usage",
    color: "text-violet-600",
    bg: "bg-violet-50",
    activeBorder: "border-violet-500",
    activeText: "text-violet-700",
    activeBg: "bg-violet-50/70",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
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
      const data = await getRecruiterProfile();
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-400">
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
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <User className="h-7 w-7 text-slate-400" />
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
    <div className="min-h-screen bg-slate-100/60">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)] pt-16">
        <div className="hidden lg:block">
          <Sidebar activeItem="profile" />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-16 z-20 bg-white border-b border-slate-200/80 shadow-[0_1px_8px_0_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between px-7 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                  <Settings className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900 leading-none tracking-tight">
                    Account Settings
                  </h1>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-none">
                    Manage your profile, security and billing preferences
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Settings</span>
                <ChevronRight className="h-3 w-3" />
                <span className={cn("font-semibold", activeTabMeta.activeText)}>
                  {activeTabMeta.label}
                </span>
              </div>
            </div>

            <div className="flex items-stretch px-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "relative flex-1 flex items-center justify-center gap-2",
                      "py-3 px-3 text-xs transition-all duration-150 focus:outline-none",
                      "border-b-2",
                      active
                        ? cn(tab.activeBorder, tab.activeText, tab.activeBg)
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0",
                        active
                          ? cn(tab.bg, "shadow-sm")
                          : "bg-transparent group-hover:bg-slate-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 transition-colors",
                          active ? tab.color : "text-slate-400",
                        )}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className={cn(
                        "whitespace-nowrap tracking-tight",
                        active ? "font-semibold" : "font-medium",
                      )}
                    >
                      {tab.label}
                    </span>

                    {active && (
                      <span
                        className={cn(
                          "absolute -bottom-px left-1/2 -translate-x-1/2",
                          "h-0.5 w-8 rounded-full",
                          tab.dot,
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Scrollable content — padded to clear fixed bar ── */}
          <div className="flex-1 overflow-y-auto ">
            <div className="px-7 py-7 max-w-5xl mx-auto">
              {/* Section header card */}
              <div
                className={cn(
                  "flex items-center gap-4 mb-6 px-5 py-4 rounded-2xl border",
                  "bg-white border-slate-200/80 shadow-sm",
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    activeTabMeta.bg,
                  )}
                >
                  <ActiveIcon className={cn("h-5 w-5", activeTabMeta.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-slate-900 leading-none">
                    {activeTabMeta.label}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {activeTabMeta.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "hidden sm:inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0",
                    activeTabMeta.badge,
                  )}
                >
                  {activeTabMeta.label}
                </span>
              </div>

              {/* Content card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8">
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
