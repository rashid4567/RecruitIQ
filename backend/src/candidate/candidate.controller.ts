import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import {
    getCandidateProfileService,
    updateCandidateProfileService,
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
        console.error("❌ Get profile error:", err);
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

        const userId = req.user.userId;


        const updatedProfile = await updateCandidateProfileService(
            userId,
            req.body
        );

        if (!updatedProfile) {
          
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Failed to update profile",
            });
        }

     
        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        });
    } catch (err) {
        console.error("❌ Update profile error:", err);
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: getError(err),
        });
    }
};