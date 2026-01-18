import nodemailer from "nodemailer";
import { logEmail } from "./email-logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "📧 EMAIL_PASS:",
  process.env.EMAIL_PASS ? "SET" : "NOT SET"
);

/* ================= OTP EMAIL ================= */
export const sendOtp = async (to: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"RecruitIQ" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Email Verification OTP",
      html: `
        <h3>Email Verification</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    logEmail({
      type: "REAL",
      to,
      subject: "Email Verification OTP",
      status: "SENT",
    });
  } catch (err: any) {
    logEmail({
      type: "REAL",
      to,
      subject: "Email Verification OTP",
      status: "FAILED",
      error: err.message,
    });
    throw err;
  }
};

/* ============== PASSWORD RESET EMAIL ============== */
export const sendPasswordLink = async (
  to: string,
  resetLink: string
) => {
  try {
    await transporter.sendMail({
      from: `"RecruitIQ" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset Request</h3>
        <p>You requested to reset your password.</p>
        <p>
          <a href="${resetLink}" target="_blank">
            Reset Password
          </a>
        </p>
        <p>This link expires in <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    logEmail({
      type: "REAL",
      to,
      subject: "Reset Your Password",
      status: "SENT",
    });
  } catch (err: any) {
    logEmail({
      type: "REAL",
      to,
      subject: "Reset Your Password",
      status: "FAILED",
      error: err.message,
    });
    throw err;
  }
};

/* ================= TEST EMAIL ================= */
export const sendTestEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: `"RecruitIQ Test" <${process.env.EMAIL_USER}>`,
      to,
      subject: `[TEST] ${subject}`,
      html,
    });

    logEmail({
      type: "TEST",
      to,
      subject,
      status: "SENT",
    });
  } catch (err: any) {
    logEmail({
      type: "TEST",
      to,
      subject,
      status: "FAILED",
      error: err.message,
    });
    throw err;
  }
};
