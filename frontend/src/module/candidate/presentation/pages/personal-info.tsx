import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import CandidateSidebar from "@/components/sidebar/candidateSidebar";
import { CandidatePrivacyAndSecurity } from "./personalInfo/components/tabs/CandidatePrivacyAndSecurity";
import { NotificationsSection } from "./NotificationsSection";
import { PrivacySection } from "./PrivacySection";
import { PersonalInfoTab } from "./personalInfo/components/tabs/PersonalInfoTab";
import { Header } from "./personalInfo/components/common/Header";
import { LoadingState } from "./personalInfo/components/common/LoadingState";
import { ErrorState } from "./personalInfo/components/common/ErrorState";

import { useCandidateProfile } from "../hooks/useCandidateProfile";
import { useProfileEdit } from "../hooks/useProfileEdit";
import { useImageUpload } from "../hooks/useImageUpload";
import { useProfileStats } from "../hooks/useProfileStats";

import {
  validateProfileField,
  validateProfileForm,
  type ProfileFormData,
} from "../validators/profileValidation";

const settingsTabs = [
  {
    value: "personal-info",
    label: "Personal Info",
    icon: User,
    description: "Your personal details, skills, bio and preferences",
  },
  {
    value: "security",
    label: "Security",
    icon: Shield,
    description: "Password, sessions and login methods",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Email, in-app and job alert preferences",
  },
  {
    value: "privacy",
    label: "Privacy",
    icon: Lock,
    description: "Control who can see your profile and data",
  },
] as const;

type TabValue = (typeof settingsTabs)[number]["value"];

export default function CandidateProfilePage() {
  const [activeTab, setActiveTab] = useState<TabValue>("personal-info");

  const { profile, loading, isUpdating, error, loadProfile, updateProfile } =
    useCandidateProfile();

  const stats = useProfileStats(profile);

  const {
    isEditing,
    editData,
    validationErrors,
    startEdit,
    cancelEdit,
    updateField,
    setValidationErrors,
  } = useProfileEdit(profile);

  const {
    uploadImage,
    uploading: isUploading,
    preview: imagePreview,
    clearPreview,
  } = useImageUpload((imageData) => updateField("profileImage", imageData));

  const validateFieldWithZod = useCallback(
    <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) =>
      validateProfileField(field, value),
    [],
  );

  const validateAllWithZod = useCallback((): boolean => {
    if (!profile) return false;

    const result = validateProfileForm({
      fullName: editData.fullName ?? profile.fullName,
      email: editData.email ?? profile.email,
      currentJob: editData.currentJob ?? profile.currentJob,
      experienceYears:
        editData.experienceYears ?? profile.experienceYears ?? undefined,
      educationLevel: editData.educationLevel ?? profile.educationLevel,
      currentJobLocation:
        editData.currentJobLocation ?? profile.currentJobLocation,
      gender: editData.gender ?? profile.gender,
      linkedinUrl: editData.linkedinUrl ?? profile.linkedinUrl ?? "",
      portfolioUrl: editData.portfolioUrl ?? profile.portfolioUrl ?? "",
      bio: editData.bio ?? profile.bio ?? "",
      skills: editData.skills ?? profile.skills ?? [],
      preferredJobLocations:
        editData.preferredJobLocations ?? profile.preferredJobLocations ?? [],
    });

    if (!result.success) {
      const errors: Partial<Record<keyof ProfileFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ProfileFormData;
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      });
      setValidationErrors(errors);
      toast.error("Please fix the validation errors before saving.");
      return false;
    }

    setValidationErrors({});
    return true;
  }, [editData, profile, setValidationErrors]);

  const handleInputChange = useCallback(
    <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
      updateField(key, value);
      const fieldError = validateFieldWithZod(key, value);
      setValidationErrors((prev) => ({
        ...prev,
        [key]: fieldError ?? undefined,
      }));
    },
    [updateField, validateFieldWithZod, setValidationErrors],
  );

  const handleSave = useCallback(async () => {
    if (!profile || isUpdating) return;
    if (!validateAllWithZod()) return;

    try {
      const updatedProfile = profile.update(editData);
      await updateProfile(updatedProfile);
      cancelEdit();
      clearPreview();
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  }, [
    profile,
    isUpdating,
    editData,
    validateAllWithZod,
    updateProfile,
    cancelEdit,
    clearPreview,
  ]);

  if (loading && !profile) return <LoadingState />;
  if (!profile) return <ErrorState onRetry={loadProfile} loading={loading} />;

  return (
    <div className="min-h-screen bg-slate-50/70 flex">
      <CandidateSidebar
        user={{
          fullName: profile.fullName,
          email: profile.email,
          profileImage: profile.profileImage,
        }}
      />

      <main className="flex-1 flex flex-col min-h-0">
        <Header profile={profile} error={error} onRetry={loadProfile} />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your profile, security and preferences
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as TabValue)}
                  className="space-y-6"
                >
                  <TabsList className="h-14 w-full justify-start bg-muted/60 overflow-x-auto">
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <div className="pt-2">
                    <TabsContent
                      value="personal-info"
                      className="mt-0 space-y-6 focus-visible:outline-none"
                    >
                      <div>
                        <h2 className="text-xl font-semibold">Personal Info</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {
                            settingsTabs.find(
                              (t) => t.value === "personal-info",
                            )?.description
                          }
                        </p>
                        <Separator className="my-5" />
                        <PersonalInfoTab
                          profile={profile}
                          stats={stats}
                          isEditing={isEditing}
                          editData={editData}
                          validationErrors={validationErrors}
                          isUploading={isUploading}
                          imagePreview={imagePreview}
                          onInputChange={handleInputChange}
                          onImageUpload={uploadImage}
                          onEditToggle={startEdit}
                          onSave={handleSave}
                          onCancel={cancelEdit}
                          loading={isUpdating}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="security"
                      className="mt-0 space-y-6 focus-visible:outline-none"
                    >
                      <div>
                        <h2 className="text-xl font-semibold">Security</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {
                            settingsTabs.find((t) => t.value === "security")
                              ?.description
                          }
                        </p>
                        <Separator className="my-5" />
                        <CandidatePrivacyAndSecurity />
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="notifications"
                      className="mt-0 space-y-6 focus-visible:outline-none"
                    >
                      <div>
                        <h2 className="text-xl font-semibold">Notifications</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {
                            settingsTabs.find(
                              (t) => t.value === "notifications",
                            )?.description
                          }
                        </p>
                        <Separator className="my-5" />
                        <NotificationsSection />
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="privacy"
                      className="mt-0 space-y-6 focus-visible:outline-none"
                    >
                      <div>
                        <h2 className="text-xl font-semibold">Privacy</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {
                            settingsTabs.find((t) => t.value === "privacy")
                              ?.description
                          }
                        </p>
                        <Separator className="my-5" />
                        <PrivacySection />
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