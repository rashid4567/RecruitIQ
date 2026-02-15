import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { UpdateCandidateProfileUseCase } from "../../application/use-cases/update-candidate-profile.usecase";
import { userIdSchema } from "../validator/userId.validatort";
import { updateCandidateProfileSchema } from "../validator/updateCandidate-validator";

export class UpdateCandidateProfileController {
  constructor(
    private readonly updateProfileUC: UpdateCandidateProfileUseCase,
  ) {}

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Raw body:", req.body);

      // validate user id
      const userId = userIdSchema.parse(req.user?.userId);

      // validate request body
      const body = updateCandidateProfileSchema.parse(req.body);

      console.log("Parsed body:", body);

      // execute usecase
      const result = await this.updateProfileUC.execute(userId, body);

      // send response
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Profile updated successfully",
        data: result,
      });

    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}
