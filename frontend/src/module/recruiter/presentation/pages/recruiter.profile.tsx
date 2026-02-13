"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, CreditCard } from "lucide-react";
import { toast } from "sonner";

import RecruiterHeader from "@/components/recruiter/header";
import { Sidebar } from "@/components/sidebar/recruiterSidebar";

import { RecruiterProfileSection } from "./profileSeting/ProfileSection";
import { SecuritySection } from "./profileSeting/SecuritySection";
import { NotificationsSection } from "./profileSeting/NotificationsSection";
import { BillingSection } from "./profileSeting/BillingSection";

import { GetRecruiterProfileUc } from "../di/recruiter.di";
import type { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";

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

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <User className="h-6 w-6 animate-pulse" />
          <span className="text-sm font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  // ❌ Error / empty state
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <User className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="text-slate-700 font-medium">
            Unable to load recruiter profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <RecruiterHeader />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Sidebar
            profile={profile}
            userStats={userStats}
            activePath="/recruiter/settings"
          />

          {/* Settings Tabs */}
          <div className="lg:col-span-3 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 bg-white shadow-sm border">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="billing" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>

              {/* Profile */}
              <TabsContent value="profile">
                <RecruiterProfileSection />
              </TabsContent>

              {/* Security */}
              <TabsContent value="security">
                <SecuritySection />
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications">
                <NotificationsSection />
              </TabsContent>

              {/* Billing */}
             
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
