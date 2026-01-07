import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { getError } from "../utils/getErrorMessage";
import {
  getRecruiterProfileService,
  updateRecruiterProfileService,
} from "./recruiter.service";


export const getRecruiterProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.userId;

    const profile = await getRecruiterProfileService(userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: getError(err),
    });
  }
};



export const updateRecruiterProfile = async (req : Request, res : Response) =>{
    try{
        if(!req.user){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success : false,
                message : "User not authenticated"
            })
        }
        const userId = req.user.userId;
        const updatedProfile  = await updateRecruiterProfileService(userId,req.body);
        if(!updatedProfile){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success : false,
                message : "Recruiter Profile update failed",
            })
        }
        res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "Updated succesfully",
            data : updatedProfile ,
        })
    }catch(err){
        console.error(err);
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success : false,
            message : getError(err),
        })
    }
}