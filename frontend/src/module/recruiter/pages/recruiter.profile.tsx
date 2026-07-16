import { useEffect, useState } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import Sidebar from "./components/layout/Sidebar";

import { RecruiterProfileSection } from "./components/Recruiter-profile/ProfileSection";
import { NotificationsSection } from "./components/profileSeting/NotificationsSection";
import { BillingSection } from "./components/profileSeting/BillingSection";
import { getRecruiterProfile } from "../api/recruiter.api";
import type { RecruiterProfile } from "../types/recruiter.types";
import { SecuritySection } from "./components/SecuritySection/SecuritySection";
import Header from "@/module/auth/pages/home/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const settingsTabs = [
  {
    value: "profile",
    label: "Profile",
    shortLabel: "Profile",
    icon: User,
    description: "Manage your company details, logo and recruiter information.",
  },
  {
    value: "security",
    label: "Security",
    shortLabel: "Security",
    icon: Shield,
    description: "Password, 2FA, sessions and login methods.",
  },
  {
    value: "notifications",
    label: "Notifications",
    shortLabel: "Notify",
    icon: Bell,
    description: "Email, in-app, job alerts and marketing.",
  },
  {
    value: "billing",
    label: "Billing & Plan",
    shortLabel: "Billing",
    icon: CreditCard,
    description: "Plan, payment methods, invoices and usage.",
  },
] as const;

const TAB_THEME = {
  color: "text-indigo-600",
  bg: "bg-indigo-50",
  activeBorder: "border-indigo-600",
  activeText: "text-indigo-700",
  activeBg: "bg-indigo-50/70",
  dot: "bg-indigo-500",
  badge: "bg-indigo-100 text-indigo-700",
};

type TabValue = (typeof settingsTabs)[number]["value"];

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type BannerFields = {
  fullName?: string;
  companyName?: string;
  profileImage?: string;
  role?: string;
  subscriptionPlan?: string;
  profileCompletion?: number;
};

function ContentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4 px-5 py-4 rounded-3xl border border-slate-200/80 bg-white">
        <div className="h-11 w-11 rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded bg-slate-100" />
          <div className="h-3 w-56 rounded bg-slate-100" />
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 lg:p-8 space-y-4">
        <div className="h-3.5 w-40 rounded bg-slate-100" />
        <div className="h-3 w-full max-w-md rounded bg-slate-100" />
        <div className="h-3 w-full max-w-sm rounded bg-slate-100" />
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

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
  const banner = profile as unknown as BannerFields | null;

  if (!loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-100/60">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] pt-16 items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center max-w-sm w-full">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <User className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              We couldn't load your settings
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
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                  <Settings className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-slate-900 leading-none tracking-tight sm:hidden">
                    Settings
                  </h1>
                  <h1 className="hidden sm:block text-sm font-bold text-slate-900 leading-none tracking-tight">
                    Account Settings
                  </h1>
                  <p className="hidden sm:block text-[11px] text-slate-400 mt-0.5 leading-none">
                    Manage your profile, security and billing preferences
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
                <span className="hidden sm:inline">Recruiter</span>
                <ChevronRight className="hidden sm:inline h-3 w-3" />
                <span className="hidden sm:inline">Settings</span>
                <ChevronRight className="hidden sm:inline h-3 w-3" />
                <span className={cn("font-semibold", TAB_THEME.activeText)}>
                  {activeTabMeta.label}
                </span>
              </div>
            </div>

            <div className="flex items-stretch gap-1 px-2 overflow-x-auto sm:overflow-visible">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "relative flex-none sm:flex-1 flex items-center justify-center gap-2",
                      "py-3 px-4 sm:px-3 text-xs transition-all duration-150 focus:outline-none",
                      "border-b-2",
                      active
                        ? cn(
                            TAB_THEME.activeBorder,
                            TAB_THEME.activeText,
                            TAB_THEME.activeBg,
                          )
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0",
                        active
                          ? cn(TAB_THEME.bg, "shadow-sm")
                          : "bg-transparent",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 transition-colors",
                          active ? TAB_THEME.color : "text-slate-400",
                        )}
                      />
                    </div>

                    <span
                      className={cn(
                        "hidden sm:inline lg:hidden whitespace-nowrap tracking-tight",
                        active ? "font-semibold" : "font-medium",
                      )}
                    >
                      {tab.shortLabel}
                    </span>
                    <span
                      className={cn(
                        "hidden lg:inline whitespace-nowrap tracking-tight",
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
                          TAB_THEME.dot,
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-5 lg:py-8 max-w-7xl space-y-5 sm:space-y-6 lg:space-y-8">
              {loading ? (
                <ContentSkeleton />
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-4 px-5 py-4 rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_32px_-8px_rgba(15,23,42,0.06)]">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage
                        src={banner?.profileImage}
                        alt={banner?.fullName ?? ""}
                      />
                      <AvatarFallback className="bg-linear-to-br from-indigo-600 to-blue-500 text-white font-bold">
                        {getInitials(banner?.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {banner?.fullName ?? "Recruiter"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {[banner?.role ?? "Recruiter", banner?.companyName]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>

                    {banner?.subscriptionPlan && (
                      <button
                        onClick={() => setActiveTab("billing")}
                        className={cn(
                          "text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 transition-colors",
                          TAB_THEME.badge,
                          "hover:opacity-80",
                        )}
                      >
                        {banner.subscriptionPlan} Plan
                      </button>
                    )}

                    {typeof banner?.profileCompletion === "number" && (
                      <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-40 shrink-0">
                        <Progress
                          value={banner.profileCompletion}
                          className="h-1.5"
                        />
                        <span className="text-xs font-medium text-slate-500 shrink-0">
                          {banner.profileCompletion}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 px-5 py-4 rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_32px_-8px_rgba(15,23,42,0.06)]">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        TAB_THEME.bg,
                      )}
                    >
                      <ActiveIcon className={cn("h-5 w-5", TAB_THEME.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-slate-900 leading-none">
                        {activeTabMeta.label}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1.5 leading-snug">
                        {activeTabMeta.description}
                      </p>
                    </div>
                  </div>

                  <div
                    key={activeTab}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.06)] overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-200"
                  >
                    <div className="p-6 lg:p-8">
                      {activeTab === "profile" && <RecruiterProfileSection />}
                      {activeTab === "security" && <SecuritySection />}
                      {activeTab === "notifications" && (
                        <NotificationsSection />
                      )}
                      {activeTab === "billing" && <BillingSection />}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
