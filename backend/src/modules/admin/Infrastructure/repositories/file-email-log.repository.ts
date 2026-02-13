import fs from "fs";
import path from "path";
import { EmailLogRepository } from "../../Domain/repositories/email-log.repository";
import { EmailLog } from "../../Domain/entities/email-log.entity";


const logFile = path.join(process.cwd(), "logs", "email.log")

export class FileEmailLogRepository  implements EmailLogRepository{
    async list():Promise<EmailLog[]>{
        if(!fs.existsSync(logFile))return [];
        const data = fs.readFileSync(logFile,"utf-8");
        return data.split("\n").filter(Boolean).map((line)=>{
            try{
                const parsed = JSON.parse(line);
                return new EmailLog(
                    parsed.type,
                    parsed.to,
                    parsed.subject,
                    parsed.status,
                    parsed.timestamp,
                    parsed.error,
                )
            }catch{
                return null
            }
        }).filter(Boolean) as EmailLog[]
    }
}