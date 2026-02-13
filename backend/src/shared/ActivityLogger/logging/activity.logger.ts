import { ActivityLogData } from "../types/activity.types";
import { winstonLogger } from "./winston.logger";

export const logActivity = (data : ActivityLogData) =>{
    try{
        winstonLogger.info({
            type : "ACTIVITY_LOG",
            ...data,
        })
    }catch(err){
        console.error("Activity loggin failed : ", err);
    }
}