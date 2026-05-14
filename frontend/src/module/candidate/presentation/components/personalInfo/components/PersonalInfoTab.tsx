import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit2, Save, X, Loader2 } from "lucide-react";

import type { CandidateProfile } from "@/module/candidate/domain/entities/candidateProfile";
import type { ProfileFormData } from "../../../validators/profileValidation.ts";

import { useEmailUpdate } from "../../../hooks/useEmailUpdate";
import { ProfileCard } from "../../../pages/personalInfo/components/cards/ProfileCard";
import { ProfileStrengthCard } from "../../../pages/personalInfo/components/cards/ProfileStrengthCard";
import { BasicInfoSection } from "../../../pages/personalInfo/components/sections/BasicInfoSection";
import { ProfessionalInfoSection } from "../../../pages/personalInfo/components/sections/ProfessionalInfoSection";
import { AdditionalInfoSection } from "../../../pages/personalInfo/components/sections/AdditionalInfoSection";
import { SocialSection } from "../../../pages/personalInfo/components/sections/SocialSection";
import { BioSection } from "../../../pages/personalInfo/components/sections/BioSection";
import { EmailVerificationModal } from "../../../pages/personalInfo/components/modal/email.update.modal";

export interface ProfileStats {
  experienceYears: number;
  skillsCount: number;
  completionPercentage: number;
}

interface PersonalInfoTabProps {
  profile: CandidateProfile;
  stats: ProfileStats;
  isEditing: boolean;
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
  isUploading: boolean;
  imagePreview: string | null;
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
  onFieldBlur: (field: keyof ProfileFormData) => void;
  getFieldError: (field: keyof ProfileFormData) => string | undefined;
  isFieldValid: (field: keyof ProfileFormData) => boolean;
  onImageUpload: (file: File) => Promise<void>;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function PersonalInfoTab({
  profile,
  stats,
  isEditing,
  editData,
  validationErrors,
  isUploading,
  imagePreview,
  onInputChange,
  onFieldBlur,
  getFieldError,
  isFieldValid,
  onImageUpload,
  onEditToggle,
  onSave,
  onCancel,
  loading,
}: PersonalInfoTabProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const { sendOtp, verifyOtp, sendingOtp, verifyingOtp } = useEmailUpdate();

  const handleVerifyClick = async (emailToVerify: string) => {
    const trimmedEmail = emailToVerify.trim();
    if (!trimmedEmail || trimmedEmail === profile.email || sendingOtp) return;
    const success = await sendOtp(trimmedEmail);
    if (success) {
      setPendingEmail(trimmedEmail);
      setIsEmailModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsEmailModalOpen(false);
    setPendingEmail("");
  };

  const getCompletionMessage = (): string => {
    const percentage = stats.completionPercentage;
    if (percentage === 100) return "Perfect! Your profile is complete 🎉";
    if (percentage >= 80) return "Almost there! Just a few more details";
    if (percentage >= 60) return "Good progress! Keep going";
    if (percentage >= 40) return "You're on the right track";
    return "Let's complete your profile";
  };


  const hasVisibleErrors = (Object.keys(validationErrors) as Array<keyof ProfileFormData>).some(
    (field) => !!getFieldError(field),
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
     
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <ProfileCard
              profile={profile}
              isEditing={isEditing}
              editData={editData}
              stats={stats}
              onInputChange={onInputChange}
              onVerifyEmail={handleVerifyClick}
              onImageUpload={onImageUpload}
              loading={loading}
              imagePreview={imagePreview}
              isUploading={isUploading}
            />
            <ProfileStrengthCard
              completionPercentage={stats.completionPercentage}
              completionMessage={getCompletionMessage()}
            />
          </div>
        </div>


        <div className="lg:col-span-2 space-y-6">

          <Card className="relative border-0 shadow-lg bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">Personal Information</h1>
                  <p className="text-slate-300 text-sm">
                    {isEditing
                      ? "Update your details to make your profile stand out"
                      : "View and manage your professional details"}
                  </p>
                </div>

                {!isEditing && (
                  <Button
                    onClick={onEditToggle}
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>


          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-8">
              <div className="space-y-8">
       
                <BasicInfoSection
                  isEditing={isEditing}
                  profile={profile}
                  editData={editData}
                  validationErrors={validationErrors}
                  sendingOtp={sendingOtp}
                  onInputChange={onInputChange}
                  onFieldBlur={onFieldBlur}
                  getFieldError={getFieldError}
                  isFieldValid={isFieldValid}
                  onVerifyEmail={handleVerifyClick}
                />

                <Separator className="bg-slate-200" />

          
                <ProfessionalInfoSection
                  isEditing={isEditing}
                  profile={profile}
                  editData={editData}
                  validationErrors={validationErrors}
                  onInputChange={onInputChange}
                  onFieldBlur={onFieldBlur}
                  getFieldError={getFieldError}
                  isFieldValid={isFieldValid}
                />

                <Separator className="bg-slate-200" />

      
                <AdditionalInfoSection
                  isEditing={isEditing}
                  profile={profile}
                  editData={editData}
                  validationErrors={validationErrors}
                  onInputChange={onInputChange}
                  onFieldBlur={onFieldBlur}
                  getFieldError={getFieldError}
                  isFieldValid={isFieldValid}
                />

                <Separator className="bg-slate-200" />

                <SocialSection
                  isEditing={isEditing}
                  profile={profile}
                  editData={editData}
                  validationErrors={validationErrors}
                  onInputChange={onInputChange}
                  onFieldBlur={onFieldBlur}
                  getFieldError={getFieldError}
                  isFieldValid={isFieldValid}
                />

                <Separator className="bg-slate-200" />


                <BioSection
                  isEditing={isEditing}
                  profile={profile}
                  editData={editData}
                  validationErrors={validationErrors}
                  onInputChange={onInputChange}
                  onFieldBlur={onFieldBlur}
                  getFieldError={getFieldError}
                  isFieldValid={isFieldValid}
                />

                {isEditing && (
                  <div className="flex items-center gap-4 pt-6">
                    <Button
                      onClick={onSave}
                      disabled={loading || hasVisibleErrors}
                      size="lg"
                      className="flex-1 h-12 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={onCancel}
                      disabled={loading}
                      size="lg"
                      className="flex-1 h-12 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={handleCloseModal}
        email={pendingEmail}
        onVerifyOtp={verifyOtp}
        verifyingOtp={verifyingOtp}
      />
    </>
  );
}