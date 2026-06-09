import { Request , Response, NextFunction } from "express";
import { MarkAllNotificationsAsReadUseCase } from "../../application/usecases/MarkAllNotificationsAsReadUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";


export class MarkAllNotificationsAsReadController{
    constructor(
        private readonly markAllNotificationAsReadUC : MarkAllNotificationsAsReadUseCase
    ){};

    markAllsRead = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recipientId = req.user?.userId;
            if(!recipientId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Unauthorized"
                })
            }

            const markAsRead = await this.markAllNotificationAsReadUC.execute(recipientId);
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "All notifications marked as read",
                data : markAsRead,
            }) 
        }catch(err){
            next(err);
        }
    }
}