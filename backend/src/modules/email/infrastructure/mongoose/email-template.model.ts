import { model, Schema } from "mongoose";
import { EmailEvent } from "../../domain/constant/templateEvents";

const emailTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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

  { timestamps: true },
);

export const EmailTemplateModel = model("EmailTemplate", emailTemplateSchema);
