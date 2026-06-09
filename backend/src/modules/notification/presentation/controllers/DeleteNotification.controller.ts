import { Request, Response, NextFunction } from "express";
import { DeleteNotificationUseCase } from "../../application/usecases/DeleteNotificationUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";


export class DeleteNotificationController {
    constructor(
        private readonly deleteNotificationUC : DeleteNotificationUseCase
    ){};


    deleteNotification = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {id} = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "Unauthorized"
                })
            }

            const notification = await this.deleteNotificationUC.execute(id);

            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Message deleted succesfully",
                data : notification
            })
        }catch(err){
            next(err);
        }
    }
}