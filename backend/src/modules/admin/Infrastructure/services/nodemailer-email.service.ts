import nodemailer from "nodemailer";
import { EmailService } from "../../Domain/services/email.service";
import { logEmail } from "../../../../utils/email-logger";

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    },
})

export class NodemailerEmailService implements EmailService{
    async send(data: { to: string; subject: string; body: string; type?: "REAL" | "TEST"; }): Promise<void> {
        const {to, subject , body, type = "REAL"} = data;

        await transporter.sendMail({
            from : `"RecruitIQ" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html : body,
        })

        logEmail({
            type,
            to,
            subject,
            status : "SENT",
        })
    }
}