"use client";

import { useCallback, useState } from "react";
import { User, Shield, Bell, Lock } from "lucide-react";
import CandidateSidebar from "@/components/sidebar/candidateSidebar";
import { SecuritySection } from "@/pages/candidate/profileSetting/SecuritySection";
import { NotificationsSection } from "@/pages/candidate/profileSetting/NotificationsSection";
import { PrivacySection } from "@/pages/candidate/profileSetting/PrivacySection";

import { useCandidateProfile } from "../hooks/useCandidateProfile";
import { useImageUpload } from "../hooks/useImageUpload";
import { useProfileEdit } from "../hooks/useProfileEdit";
import { useProfileStats } from "../hooks/useProfileStats";
import { useSettingsTab } from "../hooks/useSetting.tabs";

import { toast } from "sonner";
import { LoadingState } from "../components/candidate-Profile/LoadingState";
import { ErrorState } from "../components/candidate-Profile/ErrorState";
import Header from "@/components/candidate/header";
import { SettingsTabs } from "../components/candidate-Profile/SettingsTabs";
import { PersonalInfoTab } from "../components/candidate-Profile/personalInfoTab/PersonalInfoTab"

import {
  validateProfileField,
  validateProfileForm,
  type ProfileFormData,
} from "../validators/profileValidation";

export default function CandidateProfilePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { profile, loading, error, loadProfile, updateProfile } =
    useCandidateProfile();


  const stats = useProfileStats(profile);
  const { activeTab, setActiveTab } = useSettingsTab();

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
  } = useImageUpload((imageData) =>
    updateField("profileImage" as any, imageData),
  );

  const settingsTabs = [
    { id: "Personal Info", icon: User },
    { id: "Security", icon: Shield },
    { id: "Notifications", icon: Bell },
    { id: "Privacy", icon: Lock },
  ];

  const validateFieldWithZod = useCallback(
    <K extends keyof ProfileFormData>(
      field: K,
      value: ProfileFormData[K],
    ): string => {
      return validateProfileField(field, value);
    },
    [],
  );

  const validateAllWithZod = useCallback((): boolean => {
    if (!profile) return false;

    const safeGender =
      profile.gender === "male" ||
      profile.gender === "female" ||
      profile.gender === "other"
        ? profile.gender
        : undefined;

    const dataToValidate: ProfileFormData = {
      fullName: editData.fullName ?? profile.fullName,
      email: editData.email ?? profile.email,
      currentJob: editData.currentJob ?? profile.currentJob,
      experienceYears:
        editData.experienceYears ?? profile.experienceYears ?? undefined,
      educationLevel: editData.educationLevel ?? profile.educationLevel,
      currentJobLocation:
        editData.currentJobLocation ?? profile.currentJobLocation,
      gender: editData.gender ?? safeGender,
      linkedinUrl: editData.linkedinUrl ?? profile.linkedinUrl ?? "",
      portfolioUrl: editData.portfolioUrl ?? profile.portfolioUrl ?? "",
      bio: editData.bio ?? profile.bio ?? "",
      skills: editData.skills ?? profile.skills ?? [],
      preferredJobLocations:
        editData.preferredJobLocations ?? profile.preferredJobLocations ?? [],
    };

    const result = validateProfileForm(dataToValidate);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setValidationErrors(errors);
      toast.error(`Please fix ${Object.keys(errors).length} error(s)`);
      return false;
    }

    setValidationErrors({});
    return true;
  }, [editData, profile, setValidationErrors]);

  const handleInputChange = useCallback(
    <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
      updateField(key as any, value);

      const error = validateFieldWithZod(key, value);
      if (error) {
        setValidationErrors((prev) => ({ ...prev, [key]: error }));
      } else {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [updateField, validateFieldWithZod, setValidationErrors],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      await uploadImage(file);
    },
    [uploadImage],
  );

  const refreshProfile = useCallback(async () => {
    try {
      const toastId = toast.loading("Refreshing profile...");
      await loadProfile();
      setRefreshTrigger((prev) => prev + 1);
      toast.dismiss(toastId);
      console.log("✅ Profile refreshed successfully");
    } catch (error) {
      console.error("❌ Failed to refresh profile:", error);
      toast.error("Failed to refresh profile");
    }
  }, [loadProfile]);

  const handleSave = useCallback(async () => {
    if (!profile || loading) return;
    if (!validateAllWithZod()) return;

    try {
      const cleanedEditData = Object.fromEntries(
        Object.entries(editData).filter(([_, v]) => v !== undefined),
      );

      const updated = profile.update(cleanedEditData);
      const success = await updateProfile(updated);

      if (success) {
        cancelEdit();
        clearPreview();
        toast.success("Profile updated successfully!", {
          description: "Your changes have been saved.",
          duration: 3000,
        });
        await refreshProfile();
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Something went wrong while saving", {
        description: "Please try again.",
        duration: 4000,
      });
    }
  }, [profile, editData, updateProfile, cancelEdit, validateAllWithZod, loading, refreshProfile, clearPreview]);

  const handleVerifyEmail = useCallback(async () => {
    toast.info("Email verification feature coming soon");
  }, []);

  const handleStartEdit = useCallback(() => {
    startEdit();
    if (imagePreview) clearPreview();
  }, [startEdit, imagePreview, clearPreview]);

  const handleCancelEdit = useCallback(() => {
    cancelEdit();
    clearPreview();
  }, [cancelEdit, clearPreview]);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab as any);
    },
    [setActiveTab],
  );

  if (loading && !profile) return <LoadingState />;
  if (!profile) return <ErrorState onRetry={loadProfile} loading={loading} />;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex">
      <CandidateSidebar
        key={`sidebar-${refreshTrigger}`}
        user={{
          fullName: profile.fullName,
          email: profile.email,
          profileImage: profile.profileImage,
        }}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          key={`header-${refreshTrigger}`}
          profile={profile}
          error={error}
          onRetry={loadProfile}
        />

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <SettingsTabs
            tabs={settingsTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {activeTab === "Personal Info" && (
            <PersonalInfoTab
              key={`personal-info-${refreshTrigger}`}
              profile={profile}
              stats={stats}
              isEditing={isEditing}
              editData={editData}
              validationErrors={validationErrors}
              isUploading={isUploading}
              imagePreview={imagePreview}
              onInputChange={handleInputChange}
              onVerifyEmail={handleVerifyEmail}
              onImageUpload={handleImageUpload}
              onEditToggle={handleStartEdit}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              loading={loading}
              // ✅ No email props — PersonalInfoTab handles it internally
            />
          )}

          {activeTab === "Security" && (
            <SecuritySection key={`security-${refreshTrigger}`} />
          )}
          {activeTab === "Notifications" && (
            <NotificationsSection key={`notifications-${refreshTrigger}`} />
          )}
          {activeTab === "Privacy" && (
            <PrivacySection key={`privacy-${refreshTrigger}`} />
          )}
        </div>
      </main>
    </div>
  );
}