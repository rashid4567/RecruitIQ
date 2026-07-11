import { Request, Response, NextFunction } from "express";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

import {
  AcceptOfferRequestDTO,
  AcceptOfferResponseDTO,
} from "../../../application/dto/AcceptOfferDTO";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class AcceptOfferController {
  constructor(
    private readonly _acceptOfferUC: IUseCase<
      AcceptOfferRequestDTO,
      AcceptOfferResponseDTO
    >,
  ) {}

  accept = async (
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

      const result = await this._acceptOfferUC.execute({
        offerId: req.params.offerId,
        candidateId,
        remarks: req.body.remarks,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.OFFER_ACCEPTED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}