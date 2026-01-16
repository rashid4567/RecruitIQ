import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserServicePort } from "../ports/user.service.port";
import { UpdateRecruiterProfileDTO } from "../dto/update-recruiter-profile.dto";


export class UpdateRecruiterProfileUseCase {
constructor(
private readonly recruiterRepo: RecruiterProfileRepository,
private readonly userService: UserServicePort
) {}


async execute(userId: string, data: UpdateRecruiterProfileDTO) {
const { fullName, profileImage, ...recruiterData } = data;


if (fullName || profileImage) {
await this.userService.updateProfile(userId, { fullName, profileImage });
}


const profile = await this.recruiterRepo.updateByUserId(userId, recruiterData);
if (!profile) throw new Error("Recruiter profile not found");
return profile;
}
}