"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import RecruiterHeader from "@/components/recruiter/header";
import { Sidebar } from "@/components/sidebar/recruiterSidebar";

import { RecruiterProfileSection } from "./profileSeting/ProfileSection";
import { SecuritySection } from "./profileSeting/SecuritySection";
import { NotificationsSection } from "./profileSeting/NotificationsSection";
import { BillingSection } from "./profileSeting/BillingSection";

import { GetRecruiterProfileUc } from "../di/recruiter.di";
import type { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";

const settingsTabs = [
  {
    value: "profile",
    label: "Profile",
    icon: User,
    description: "Personal info, company details, logo, contact",
  },
  {
    value: "security",
    label: "Security",
    icon: Shield,
    description: "Password, 2FA, sessions, login methods",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Email, in-app, job alerts, marketing",
  },
  {
    value: "billing",
    label: "Billing",
    icon: CreditCard,
    description: "Plan, payment methods, invoices, usage",
  },
];

export default function RecruiterSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const userStats = {
    totalJobs: 3,
    activeJobs: 2,
    totalApplications: 24,
    interviewsScheduled: 8,
    profileCompletion: 85,
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await GetRecruiterProfileUc.execute();
      setProfile(data);
    } catch (error) {
      toast.error("Failed to load recruiter profile");
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  // Loading
  // ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/60">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-sm font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Error state
  // ────────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/60 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Couldn't load profile</CardTitle>
            <CardDescription>
              Please check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <User className="h-16 w-16 text-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Main layout
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50/70">
      <RecruiterHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column - Sidebar */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <Sidebar
                profile={profile}
                userStats={userStats}
                activePath="/recruiter/settings"
              />
            </div>
          </div>

          {/* Right column - Settings content */}
          <div className="lg:col-span-9">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl sm:text-3xl">Settings</CardTitle>
                <CardDescription className="text-base">
                  Manage your account, security and subscription preferences
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  {/* Horizontal Tabs */}
                  <TabsList className="inline-flex h-14 items-center justify-start rounded-lg bg-muted/60 p-1 text-muted-foreground w-full overflow-x-auto scrollbar-thin">
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {/* Tab content wrapper */}
                  <div className="pt-2">
                    {/* Profile */}
                    <TabsContent value="profile" className="mt-0 space-y-6 focus-visible:outline-none">
                      <div>
                        <h2 className="text-xl font-semibold">Profile</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {settingsTabs.find(t => t.value === "profile")?.description}
                        </p>
                        <Separator className="my-5" />
                        <RecruiterProfileSection />
                      </div>
                    </TabsContent>

                    {/* Security */}
                    <TabsContent value="security" className="mt-0 space-y-6 focus-visible:outline-none">
                      <div>
                        <h2 className="text-xl font-semibold">Security</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {settingsTabs.find(t => t.value === "security")?.description}
                        </p>
                        <Separator className="my-5" />
                        <SecuritySection />
                      </div>
                    </TabsContent>

                    {/* Notifications */}
                    <TabsContent value="notifications" className="mt-0 space-y-6 focus-visible:outline-none">
                      <div>
                        <h2 className="text-xl font-semibold">Notifications</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {settingsTabs.find(t => t.value === "notifications")?.description}
                        </p>
                        <Separator className="my-5" />
                        <NotificationsSection />
                      </div>
                    </TabsContent>

                    {/* Billing */}
                    <TabsContent value="billing" className="mt-0 space-y-6 focus-visible:outline-none">
                      <div>
                        <h2 className="text-xl font-semibold">Billing & Plan</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {settingsTabs.find(t => t.value === "billing")?.description}
                        </p>
                        <Separator className="my-5" />
                        <BillingSection />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}