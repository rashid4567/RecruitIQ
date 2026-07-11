import { Request, Response, NextFunction } from "express";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

import {
  CreateOfferRequestDTO,
  CreateOfferResponseDTO,
} from "../../../application/dto/createOfferDTO";

import {
  CreateOfferInput,
  createOfferSchema,
} from "../../validator/offer.validation";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class CreateOfferLetterController {
  constructor(
    private readonly _createOfferLetterUC: IUseCase<
      CreateOfferRequestDTO,
      CreateOfferResponseDTO
    >,
  ) {}

  create = async (
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

      const validatedData: CreateOfferInput = createOfferSchema.parse(req.body);
      const result = await this._createOfferLetterUC.execute({
        ...validatedData,
        recruiterId,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.OFFER_CREATED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
