import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { useRecruiterProfile } from "../../../hooks/useRecruiterProfile";
import { useRecruiterProfileForm } from "../../../hooks/useRecruiterProfileForm";
import { useAvatarUpload } from "../../../hooks/useAvatarUpload";
import { useEmailUpdateForm } from "../../../hooks/useEmailUpdate";
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

  const avatarVM = useAvatarUpload({
    maxSizeMB: 5,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

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
    avatarVM.reset();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formVM.submit();
    setIsEditing(false);
    avatarVM.reset();
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
              <div className="absolute inset-0 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 mx-auto"></div>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600">
              Loading profile...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-6 max-w-md">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">
                No Profile Found
              </h3>
              <p className="text-sm text-slate-600">
                {error || "Unable to load your profile information."}
              </p>
            </div>
            <Button onClick={fetchProfile} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <TooltipProvider>
      <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <form onSubmit={handleFormSubmit}>
          <ProfileHeader
            subscriptionStatus={profile.subscriptionStatus}
            verificationStatus={profile.verificationStatus}
          />

          <CardContent className="space-y-8 pt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 space-y-6">
                <ProfileAvatarSection
                  preview={avatarVM.preview}
                  initials={initials}
                  isEditing={isEditing}
                  isUploading={avatarVM.isUploading}
                  uploadProgress={avatarVM.uploadProgress}
                  onFileChange={avatarVM.handleFileChange}
                  onRemove={avatarVM.removeAvatar}
                />

                <AccountInfoCard
                  email={profile.email}
                  jobPostsUsed={profile.jobPostsUsed}
                  subscriptionStatus={profile.subscriptionStatus}
                  onEmailUpdateClick={emailVM.openModal}
                />
              </div>

              <div className="lg:w-2/3 space-y-8">
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
          </CardContent>

          <ProfileActionsFooter
            isEditing={isEditing}
            isDirty={formVM.isDirty}
            isSubmitting={formVM.isSubmitting}
            isUploading={avatarVM.isUploading}
            hasErrors={Object.keys(formVM.errors).length > 0}
            onEdit={handleEditClick}
            onCancel={handleCancel}
          />
        </form>
      </Card>

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
