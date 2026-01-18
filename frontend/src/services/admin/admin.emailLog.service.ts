import type { EmailLog } from "@/types/admin/email-log.types"
import api from "../../api/axios"


export const emailLogService = {
    getAll : async ():Promise<EmailLog[]> =>{
        const res = await api.get("/admin/email-logs");
        return res.data.data;
    }
}