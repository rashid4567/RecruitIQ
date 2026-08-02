import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UploadSignatureDTO } from "../../../application/dto/uploadSignature.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class UploadSignatureController {
  constructor(
    private readonly _uploadSignatureUC: IUseCase<UploadSignatureDTO, string>,
  ) {}

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const file = req.file;

      if (!file) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.SIGNATURE_FILE_REQUIRED,
        );
      }

      const offerId = req.body.offerId;
      if (!offerId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.OFFER_ID_IS_REQUIRED,
        );
      }

      const signatureUrl = await this._uploadSignatureUC.execute({
        candidateId,
        offerId,
        fileName: file.originalname,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.FILE_UPLOADED_SUCCESSFULLY,
        {
          signatureUrl,
        },
      );
    } catch (err) {
      next(err);
    }
  };
}
