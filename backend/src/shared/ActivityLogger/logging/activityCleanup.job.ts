import cron from "node-cron";
import fs from "fs/promises";
import path from "path";


const logPath = path.join(process.cwd(), "logs/activity.log");

const RETENTION_DAYS = 10;

export const startActivityCleanUpJob = () =>{

    cron.schedule("0 2 * * *", async () =>{
        try{
            console.log("Running activity log cleanup...");

            const file = await fs.readFile(logPath, "utf-8");
            const lines = file.split("\n").filter(Boolean);

            const now = Date.now();
            const retentionMS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

            const validLogs = lines.filter((line)=>{
                try{
                    const data = JSON.parse(line);
                    const timestamp = new Date(data.timeStamp).getTime()

                    return now - timestamp <= retentionMS;
                }catch{
                    return false;
                }
            })

            await fs.writeFile(logPath, validLogs.join("\n") + "\n"),
            console.log("Activity log cleanup succesfully");  
        }catch(err){
            console.error("Activity log clean up failed")
        }
    })
}