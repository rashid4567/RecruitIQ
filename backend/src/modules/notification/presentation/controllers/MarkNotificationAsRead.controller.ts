import { Request, Response, NextFunction } from "express";
import { MarkNotificationAsReadUseCase } from "../../application/usecases/MarkNotificationAsReadUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";


export class MarkNotificationAsReadController{
    constructor(
        private readonly markNotificationAsReadUC : MarkNotificationAsReadUseCase
    ){};

    markAsRead = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {id} = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "notification required"
                })
            }

            const markasRead =  await this.markNotificationAsReadUC.execute(id);
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Notifcation mark as read",
                data : markasRead,
            })
        }catch(err){
            next(err);
        }
    }
}