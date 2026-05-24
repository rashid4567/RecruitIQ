import type { RecruiterProfile } from "../../Domain/entities/recruiterEntities";
import { updateRecruiterUc } from "../../presentation/di/recruiter.di";
import { RecruiterProfileFormMapper } from "../../presentation/mappers/recruiterForm.mapper";
import type { ProfileFormData } from "../../presentation/validators/recruiter-form.validator";

export class RecruiterProfileController {
  async updateProfile(
    formData: ProfileFormData,
    currentProfile: RecruiterProfile
  ): Promise<RecruiterProfile> {
    const updatedProfile = currentProfile.updateProfile({
      fullName: formData.fullName.trim(),
      companyName: formData.companyName.trim(),
      companyWebsite: formData.companyWebsite?.trim() || undefined,
      companySize: formData.companySize ?? 0,
      industry: formData.industry ?? undefined,
      location: formData.location?.trim(),
      bio: formData.bio.trim(),
      designation: formData.designation.trim(),
      linkedinUrl: formData.linkedinUrl?.trim() || undefined,
    });

    return await updateRecruiterUc.execute(updatedProfile);
  }


  toFormData(profile: RecruiterProfile): ProfileFormData {
    return RecruiterProfileFormMapper.toForm(profile);
  }
}

export const recruiterProfileController = new RecruiterProfileController();