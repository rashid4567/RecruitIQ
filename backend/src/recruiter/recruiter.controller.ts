// src/recruiter/recruiter.controller.ts
import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { getError } from "../utils/getErrorMessage";
import {
  getRecruiterProfileService,
  updateRecruiterProfileService,
} from "./recruiter.service";

/**
 * GET /recruiter/profile
 */
export const getRecruiterProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const profile = await getRecruiterProfileService(req.user.userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: getError(err),
    });
  }
};

/**
 * PUT /recruiter/profile
 * (used by complete-profile & normal profile edit)
 */
export const updateRecruiterProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const updatedProfile = await updateRecruiterProfileService(
      req.user.userId,
      req.body
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Recruiter profile updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: getError(err),
    });
  }
};
