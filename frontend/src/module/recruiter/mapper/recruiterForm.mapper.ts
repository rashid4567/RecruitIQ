import type { RecruiterProfile } from "../types/recruiter.types"; 
import type { ProfileFormData } from "../validators/recruiter-form.validator";

export class RecruiterProfileFormMapper {
  static toForm(profile: RecruiterProfile): ProfileFormData {
    return {
      fullName: profile.fullName ?? "",
      companyName: profile.companyName ?? "",
      companyWebsite: profile.companyWebsite ?? "",
      companySize: profile.companySize ?? 0,
      industry: profile.industry ?? "",
      location: profile.location ?? "",
      bio: profile.bio ?? "",
      designation: profile.designation ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
    };
  }

  static toApi(data: ProfileFormData) {
    return {
      fullName: data.fullName.trim(),
      companyName: data.companyName.trim(),
      companyWebsite: data.companyWebsite?.trim() || undefined,
      companySize: Number(data.companySize),
      industry: data.industry,
      location: data.location?.trim() || undefined,
      bio: data.bio.trim(),
      designation: data.designation.trim(),
      linkedinUrl: data.linkedinUrl?.trim() || undefined,
    };
  }
}