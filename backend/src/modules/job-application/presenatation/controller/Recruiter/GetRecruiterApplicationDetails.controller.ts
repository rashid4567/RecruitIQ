import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetRecruiterApplicationDetailsRequestDTO, RecruiterApplicationDetailsResponseDTO } from "../../../application/dto/getRecruiterApplicationDetail.dto";

export class GetRecruiterApplicationDetailsController {
  constructor(
    private readonly _getRecruiterApplicationUC: IUseCase<
      GetRecruiterApplicationDetailsRequestDTO,
      RecruiterApplicationDetailsResponseDTO
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

      const application = await this._getRecruiterApplicationUC.execute({
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
