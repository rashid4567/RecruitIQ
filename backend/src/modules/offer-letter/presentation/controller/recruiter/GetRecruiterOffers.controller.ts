import { Request, Response, NextFunction } from "express";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

import {
  GetRecruiterOffersRequestDTO,
  GetRecruiterOffersResponseDTO,
} from "../../../application/dto/getRecruiterofferDTO";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class GetRecruiterOffersController {
  constructor(
    private readonly _getRecruiterOffersUC: IUseCase<
      GetRecruiterOffersRequestDTO,
      GetRecruiterOffersResponseDTO[]
    >,
  ) {}

  getOffers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
        return;
      }

      const result = await this._getRecruiterOffersUC.execute({
        recruiterId,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RECRUITER_OFFERS_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
