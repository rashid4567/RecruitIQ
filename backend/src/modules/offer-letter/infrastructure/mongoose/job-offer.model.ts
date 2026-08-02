import mongoose, { Document, Schema } from "mongoose";

export enum OfferStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  VIEWED = "VIEWED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
}

export interface OfferDocument extends Document {
  offerNumber: string;
  applicationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  companyName: string;
  jobTitle: string;
  annualCTC: number;
  currency: Currency;
  department?: string;
  workLocation: string;
  joiningDate: Date;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  offerDate: Date;
  expiryDate: Date;
  status: OfferStatus;
  offerLetterUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  candidateSignatureUrl: string;
  sentAt?: Date;
  viewedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  candidateRemarks?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<OfferDocument>(
  {
    offerNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "JobApplication",
      required: true,
      unique: true,
      index: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    annualCTC: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
      default: Currency.INR,
    },

    department: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    workLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    joiningDate: {
      type: Date,
      required: true,
    },

    probationPeriod: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    benefits: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    offerDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(OfferStatus),
      default: OfferStatus.DRAFT,
      required: true,
    },

    offerLetterUrl: {
      type: String,
      trim: true,
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },

    contactPhone: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    sentAt: {
      type: Date,
    },

    viewedAt: {
      type: Date,
    },

    candidateSignatureUrl: {
      type: String,
      trim: true,
    },

    acceptedAt: {
      type: Date,
    },

    rejectedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    candidateRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

OfferSchema.index({
  recruiterId: 1,
  status: 1,
  createdAt: -1,
});

OfferSchema.index({
  candidateId: 1,
  status: 1,
  createdAt: -1,
});

OfferSchema.index({
  applicationId: 1,
  status: 1,
});

OfferSchema.index({
  expiryDate: 1,
  status: 1,
});

OfferSchema.index({
  offerDate: -1,
});

OfferSchema.index({
  candidateId: 1,
  recruiterId: 1,
});

OfferSchema.index({
  jobId: 1,
  status: 1,
});

OfferSchema.index({
  status: 1,
  createdAt: -1,
});

OfferSchema.index({
  isDeleted: 1,
  status: 1,
});

export const OfferModel = mongoose.model<OfferDocument>("Offer", OfferSchema);
