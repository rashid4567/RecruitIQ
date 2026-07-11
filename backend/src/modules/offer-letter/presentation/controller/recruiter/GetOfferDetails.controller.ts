import { Request, Response, NextFunction } from "express";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

import {
  GetOfferDetailsRequestDTO,
  GetOfferDetailsResponseDTO,
} from "../../../application/dto/GetOfferDetailsDTO";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class GetOfferDetailsController {
  constructor(
    private readonly _getOfferDetailsUC: IUseCase<
      GetOfferDetailsRequestDTO,
      GetOfferDetailsResponseDTO
    >,
  ) {}

  getDetails = async (
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

      const result = await this._getOfferDetailsUC.execute({
        offerId: req.params.offerId,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.OFFER_DETAILS_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
