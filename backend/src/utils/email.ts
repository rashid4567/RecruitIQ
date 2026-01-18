import nodemailer from "nodemailer";
import { email } from "zod";

const trannsporter = nodemailer.createTransport({
  service : "gmail",
  auth : {
    user : process.env.EMAIL_USER,
    pass : process.env.EMAIL_PASS,
  }
  
})

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");


export const sentOtp = async (email: string, otp : string) =>{
  await trannsporter.sendMail({
    from: `"RecruitIQ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h3>Email Verification</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP expires in 10 minutes.</p>
    `,
  })
}


export const sendPasswordLink = async (email : string, resetLink : string) =>{
  await trannsporter.sendMail({
     from: `"RecruitIQ" <${process.env.EMAIL_USER}>`,
    to: email,
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
  })
}

export const sendTestEmail = async (to : string , subject : string, html : string) =>{
  await trannsporter.sendMail({
    from : `RecruitIQ <${process.env.EMAIL_USER}`,
    to,
    subject : `[TEST] ${subject}`,
    html,
  })
}