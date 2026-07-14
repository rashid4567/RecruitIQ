import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { useRecruiterProfile } from "../../../hooks/useRecruiterProfile";
import { useRecruiterProfileForm } from "@/module/recruiter/hooks/useRecruiterProfileForm";
import { useRecruiterEmailUpdate } from "@/module/recruiter/hooks/useEmailUpdate";
import { useUploadProfileImage } from "@/module/auth/hooks/useUploadProfileImage";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileAvatarSection } from "./avatar/AvatarSection";
import { AccountInfoCard } from "./avatar/AccountInfoCard";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { CompanyInfoForm } from "./forms/CompanyInfoForm";
import { BioSection } from "./forms/BioForm";
import { ProfileActionsFooter } from "./ProfileFooter";
import { EmailUpdateModal } from "./modals/EmailUpdateModal";

export function RecruiterProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { profile, isLoading, error, fetchProfile, updateLocalProfile } =
    useRecruiterProfile();

  const formVM = useRecruiterProfileForm({
    profile,
    onProfileUpdated: updateLocalProfile,
  });

  const {
    upload,
    loading: isUploading,
    error: uploadError,
    imagePreview: preview,
    clearPreview,
  } = useUploadProfileImage();

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 120);

    const success = await upload(file);

    clearInterval(interval);
    setUploadProgress(success ? 100 : 0);

    if (success) {
      setTimeout(() => setUploadProgress(0), 800);
    }

    e.target.value = "";
  };

  const removeAvatar = () => {
    clearPreview();
    setUploadProgress(0);
  };

  const resetAvatar = () => {
    clearPreview();
    setUploadProgress(0);
  };

  const emailVM = useRecruiterEmailUpdate(fetchProfile);

  const getInitials = (name: string) => {
    if (!name?.trim()) return "R";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = formVM.currentName ? getInitials(formVM.currentName) : "R";

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    formVM.cancel();
    setIsEditing(false);
    resetAvatar();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formVM.submit();
    setIsEditing(false);
    resetAvatar();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Loading your profile…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-center py-24">
          <div className="text-center space-y-6 max-w-xs px-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-slate-900">
                Profile unavailable
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {error ?? "We couldn't load your profile. Please try again."}
              </p>
            </div>
            <Button
              onClick={fetchProfile}
              variant="outline"
              className="gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <form onSubmit={handleFormSubmit} noValidate>
          <ProfileHeader
            subscriptionStatus={profile.subscriptionStatus}
            verificationStatus={profile.verificationStatus}
          />

          <div className="p-6 sm:p-8 space-y-8">
            {uploadError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                {uploadError}
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <aside className="lg:w-1/3 space-y-5">
                <ProfileAvatarSection
                  preview={preview ?? profile.profileImage ?? null}
                  initials={initials}
                  isEditing={isEditing}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  onFileChange={handleFileChange}
                  onRemove={removeAvatar}
                />

                <AccountInfoCard
                  email={profile.email}
                  subscriptionStatus={profile.subscriptionStatus}
                  onEmailUpdateClick={() => setIsEmailModalOpen(true)}
                />
              </aside>

              <div className="lg:w-2/3 space-y-8">
                <PersonalInfoForm
                  register={formVM.form.register}
                  errors={formVM.errors}
                  touchedFields={formVM.touchedFields}
                  isEditing={isEditing}
                  profile={profile}
                  currentEmail={profile.email ?? ""}
                  onUpdateEmailClick={() => setIsEmailModalOpen(true)}
                />

                <div className="border-t border-slate-100" />

                <CompanyInfoForm
                  register={formVM.form.register}
                  errors={formVM.errors}
                  touchedFields={formVM.touchedFields}
                  trigger={formVM.trigger}
                  isEditing={isEditing}
                  profile={profile}
                />

                <div className="border-t border-slate-100" />

                <BioSection
                  register={formVM.form.register}
                  errors={formVM.errors}
                  bioLength={formVM.bioLength}
                  wordCount={formVM.wordCount}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </div>

          <ProfileActionsFooter
            isEditing={isEditing}
            isDirty={formVM.isDirty}
            isSubmitting={formVM.isSubmitting}
            isUploading={isUploading}
            hasErrors={Object.keys(formVM.errors).length > 0}
            onEdit={handleEditClick}
            onCancel={handleCancel}
          />
        </form>
      </div>

      <EmailUpdateModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          emailVM.reset();
        }}
        onSendOtp={emailVM.sendOtp}
        onVerifyOtp={async () => {
          const success = await emailVM.verifyOtp();

          if (!success) return;

          setIsEmailModalOpen(false);
          emailVM.reset();
        }}
        onResendOtp={emailVM.resendOtp}
        newEmail={emailVM.newEmail}
        setNewEmail={emailVM.setNewEmail}
        otp={emailVM.otp}
        setOtp={emailVM.setOtp}
        otpSent={emailVM.otpSent}
        isSendingOtp={emailVM.isSendingOtp}
        isVerifyingOtp={emailVM.isVerifyingOtp}
        countdown={emailVM.countdown}
        error={emailVM.error}
        setError={emailVM.setError}
      />
    </TooltipProvider>
  );
}
