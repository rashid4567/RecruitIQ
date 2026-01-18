import { model, Schema } from "mongoose";
import { EmailEvent } from "../../domain/types/email-enum.events";

const emailTemplateSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    event: {
      type: String,
      enum: Object.values(EmailEvent),
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

export const EmailTemplateModel = model("Email",emailTemplateSchema)