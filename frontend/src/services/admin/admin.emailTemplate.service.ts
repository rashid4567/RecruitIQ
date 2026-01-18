import api from "../../api/axios"
import type{ EmailTemplate,createEmailTemplatePayload,UpdateEmailTemplatePayload,ToggleEmailInputPayload } from "@/types/admin/email-template.types"



export const emailTemplateService = {
    create : async(
        payload : createEmailTemplatePayload,
    ):Promise<EmailTemplate> =>{
        const res = await api.post("/admin/email-templates",payload);
        return res.data.data;
    },
    getAll : async() : Promise<EmailTemplate[]> =>{
        const res = await api.get("/admin/email-templates");
        return res.data.data;
    },
    update : async(id : string, payload : UpdateEmailTemplatePayload):Promise<EmailTemplate> =>{
        const res = await api.put(`/admin/email-templates/${id}`,payload)
        return res.data.data
    },

    toggle : async (id :string, payload : ToggleEmailInputPayload):Promise<void> =>{
        const res = await api.patch(`/admin/email-templates/${id}/toggle`,payload);
        return res.data.data;
    },

    sendTestEmail: async (
  id: string,
  payload: { email: string }
): Promise<void> => {
  await api.post(`/admin/email-templates/${id}/test`, payload);
},

    delete : async (
        id : string
    ):Promise<void> =>{
        await api.delete(`/admin/email-templates/${id}`)
    }

}