import nodemailer from "nodemailer";
import { logEmail } from "./email-logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendEmail = async ({
  to,
  subject,
  html,
  type,
}: {
  to: string;
  subject: string;
  html: string;
  type: "REAL" | "TEST";
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"RecruitIQ${type === "TEST" ? " Test" : ""}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    logEmail({
      type,
      to,
      subject,
      status: "SENT",
    });

    return info;
  } catch (err: unknown) {
    logEmail({
      type,
      to,
      subject,
      status: "FAILED",
      error: err instanceof Error ? err.message : "Unknown error",
    });

    throw err;
  }
};


export const sendOtp = async (to: string, otp: string) => {
  return sendEmail({
    to,
    type: "REAL",
    subject: "Email Verification OTP",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2 style="color:#0f172a">Email Verification</h2>
        <p>Your OTP is:</p>
        <div style="font-size:24px;font-weight:bold;letter-spacing:2px">${otp}</div>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `,
  });
};


export const sendPasswordLink = async (
  to: string,
  resetLink: string
) => {
  return sendEmail({
    to,
    type: "REAL",
    subject: "Reset Your Password",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2 style="color:#0f172a">Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>
          <a href="${resetLink}" target="_blank" 
             style="display:inline-block;padding:10px 16px;background:#0f172a;color:white;text-decoration:none;border-radius:6px">
            Reset Password
          </a>
        </p>
        <p>This link expires in <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};


export const sendTestEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  return sendEmail({
    to,
    subject: `[TEST] ${subject}`,
    html,
    type: "TEST",
  });
};