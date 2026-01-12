import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { getError } from "../utils/getErrorMessage";

export const notFound = (req : Request, res : Response, _next : NextFunction) =>{
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success : false,
        message : `API route not found ${req.originalUrl}`,
        code : "ROUTE_NOT_FOUND",
    })
}