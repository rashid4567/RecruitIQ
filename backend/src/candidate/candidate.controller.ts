import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import {
    getCandidateProfileService,
    updateCandidateProfileService,
    updateUserPasswordService,
} from "./candidate.service";
import { getError } from "../utils/getErrorMessage";

export const getCandidateProfile = async (req: Request, res: Response) => {
    try {
      

        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
        }
        const userId = req.user.userId;
  
        const profile = await getCandidateProfileService(userId);
        
        if (!profile) {
          
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Profile not found",
            });
        }

    
        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: profile,
        });
    } catch (err) {
        console.error(" Get profile error:", err);
        res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: getError(err),
        });
    }
};

export const updateCandidateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const profile = await updateCandidateProfileService(
      req.user.userId,
      req.body
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: getError(err),
    });
  }
};


export const updatePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    await updateUserPasswordService(
      req.user.userId,
      currentPassword,
      newPassword
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: getError(error),
    });
  }
};
