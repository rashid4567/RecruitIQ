import { Request, Response, NextFunction } from "express";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

import {
  GetCandidateOfferRequestDTO,
  GetCandidateOfferResponseDTO,
} from "../../../application/dto/getCandidateOfferDTO";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class GetCandidateOfferController {
  constructor(
    private readonly _getCandidateOfferUC: IUseCase<
      GetCandidateOfferRequestDTO,
      GetCandidateOfferResponseDTO
    >,
  ) {}

  getOffer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
        return;
      }

      const result = await this._getCandidateOfferUC.execute({
        offerId: req.params.offerId,
        candidateId,
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
