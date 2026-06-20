import { Request, Response, NextFunction } from "express";
import { GetRecruiterApplicationDetailsUseCase } from "../../../application/usecase/recruiter/GetRecruiterApplicationDetailsUseCase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetRecruiterApplicationDetailsRequestDTO } from "../../../application/dto/getRecruiterApplicationDetail.dto";
import { RecruiterApplicationDetailsOutput } from "../../../domain/repository/job-application.repository";

export class GetRecruiterApplicationDetailsController {
  constructor(
    private readonly getRecruiterApplicationUC: UseCase<
      GetRecruiterApplicationDetailsRequestDTO,
      RecruiterApplicationDetailsOutput
    >,
  ) {}

  getApplicationDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const { applicationId } = req.params;
      if (!applicationId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.APPLICATION_REQUIRED,
        });
      }

      const application = await this.getRecruiterApplicationUC.execute({
        applicationId,
        recruiterId,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.APPLICATIONS_FETCHED_SUCCESSFULLY,
        data: application,
      });
    } catch (err) {
      next(err);
    }
  };
}
