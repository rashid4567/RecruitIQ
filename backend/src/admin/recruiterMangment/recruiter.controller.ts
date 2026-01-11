import {Request, Response} from "express";
import { getRecruiterList, getRecruiterProfileService, updateRecruiterStatus, verifyRecruiter} from "./recruiter.service";
import { HTTP_STATUS } from "../../constants/httpStatus";



export const getRecruiters = async (req : Request, res : Response) =>{
    try{
        const data  = await getRecruiterList(req.query);
        res.status(HTTP_STATUS.OK).json({
            success : true,
            data,
        })
    }catch(err){
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Failed to fetch recruiters",
        })
    }
}


export const verifyRecruite = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

       

        if (!["verified", "rejected", "pending"].includes(status)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Invalid verification status",
            })
        }

        const recruiter = await verifyRecruiter(userId, status);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: `Recruiter ${status} updated successfully`,
            data: recruiter,
        })
    } catch (err: any) {
        console.error('Error verifying recruiter:', err);
        
        if (err.message.includes('not found')) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: err.message
            });
        }
        
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update verification status"
        })
    }
}


export const updateRecruiterStatusController = async (req : Request, res : Response) =>{
    try{
       
       const {userId} = req.params;
       const {isActive} = req.body;
      
       
       if (typeof isActive !== 'boolean') {
           return res.status(HTTP_STATUS.BAD_REQUEST).json({
               success : false,
               message : "isActive must be a boolean"
           })
       }
       
       const user = await updateRecruiterStatus(userId, isActive);

       res.status(HTTP_STATUS.OK).json({
        success : true,
        message : `Recruiter ${isActive ? "unblocked" : "blocked"} succesfully`,
        data : user
       })
    }catch(err){
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "failed to update the recruiter status",
        })
    }
}

export const getRecruiterProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Recruiter id is required",
      });
    }

    const recruiterProfile = await getRecruiterProfileService(id);

    if (!recruiterProfile) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: recruiterProfile,
    });
  } catch (error) {
    console.error("❌ getRecruiterProfileController error:", error);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch recruiter profile",
    });
  }
};