import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { useRecruiterProfile } from "../../../hooks/profile/useRecruiterProfile";
import { useRecruiterProfileForm } from "../../../hooks/profile/useRecruiterProfileForm";
import { useEmailUpdateForm } from "../../../hooks/profile/useEmailUpdate";
import { useUploadProfileImage } from "@/module/auth/presentation/hooks/useUploadProfileImage";
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

  const emailVM = useEmailUpdateForm(fetchProfile);

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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <p className="text-sm text-gray-400 font-medium">
              Loading profile…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-5 max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-900">
                No Profile Found
              </h3>
              <p className="text-sm text-gray-400">
                {error || "Unable to load your profile information."}
              </p>
            </div>
            <Button
              onClick={fetchProfile}
              variant="outline"
              className="gap-2 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleFormSubmit}>
          <ProfileHeader
            subscriptionStatus={profile.subscriptionStatus}
            verificationStatus={profile.verificationStatus}
          />

          <div className="p-6 sm:p-8 space-y-8">
            {uploadError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {uploadError}
              </div>
            )}
            

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-1/3 space-y-5">

              
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
                  jobPostsUsed={profile.jobPostsUsed}
                  subscriptionStatus={profile.subscriptionStatus}
                  onEmailUpdateClick={emailVM.openModal}
                />
              </div>

              {/* Right column */}
              <div className="lg:w-2/3 space-y-6">
                <PersonalInfoForm
                  register={formVM.form.register}
                  errors={formVM.errors}
                  touchedFields={formVM.touchedFields}
                  isEditing={isEditing}
                  profile={profile}
                  currentEmail={profile?.email || ""}
                  onUpdateEmailClick={emailVM.openModal}
                />

                <CompanyInfoForm
                  register={formVM.form.register}
                  errors={formVM.errors}
                  watch={formVM.watch}
                  setValue={formVM.setValue}
                  trigger={formVM.trigger}
                  isEditing={isEditing}
                  profile={profile}
                />

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
        isOpen={emailVM.isOpen}
        onClose={emailVM.closeModal}
        onSendOtp={emailVM.sendOtp}
        onVerifyOtp={emailVM.verifyOtp}
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
