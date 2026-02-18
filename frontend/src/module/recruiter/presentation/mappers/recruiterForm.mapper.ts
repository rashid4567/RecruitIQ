import { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";
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
}
