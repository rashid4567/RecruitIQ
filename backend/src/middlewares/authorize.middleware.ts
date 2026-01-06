import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";

export const authorizeRoles = (...allowedRoles : string[]) =>{
    return (req : Request, res : Response, next : NextFunction) =>{
        const userRole = req.user?.role;

        if(!userRole || !allowedRoles.includes(userRole)){
            res.status(HTTP_STATUS.FORBIDDEN).json({
                success : false,
                message : "You are not allow to access this resource"
            })
        }
        next()
    }
}