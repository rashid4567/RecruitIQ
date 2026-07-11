import { Request, Response, NextFunction } from "express";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

import {
  RejectOfferRequestDTO,
  RejectOfferResponseDTO,
} from "../../../application/dto/rejectOfferDTO";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class RejectOfferController {
  constructor(
    private readonly _rejectOfferUC: IUseCase<
      RejectOfferRequestDTO,
      RejectOfferResponseDTO
    >,
  ) {}

  reject = async (
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

      const result = await this._rejectOfferUC.execute({
        offerId: req.params.offerId,
        candidateId,
        remarks: req.body.remarks,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.OFFER_REJECTED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
