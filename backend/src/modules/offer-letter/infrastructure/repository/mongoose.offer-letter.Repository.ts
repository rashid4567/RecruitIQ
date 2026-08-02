import mongoose from "mongoose";

import {
  Currency,
  Offer,
  OfferStatus,
} from "../../domain/entity/offer-letter.entity";
import { OfferRepository } from "../../domain/repository/offer-letter.repository";
import { OfferDocument, OfferModel } from "../mongoose/job-offer.model";

export class MongooseOfferRepository implements OfferRepository {
  async create(offer: Offer): Promise<Offer> {
    const created = await OfferModel.create(this.toPersistence(offer));

    return this.toDomain(created);
  }

  async update(offer: Offer): Promise<Offer> {
    const data = offer.toObject();

    const updated = await OfferModel.findByIdAndUpdate(
      data.id,
      {
        $set: {
          annualCTC: data.annualCTC,
          currency: data.currency,
          department: data.department,
          workLocation: data.workLocation,
          joiningDate: data.joiningDate,
          probationPeriod: data.probationPeriod,
          benefits: data.benefits,
          notes: data.notes,
          expiryDate: data.expiryDate,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          status: data.status,
          offerLetterUrl: data.offerLetterUrl,
          sentAt: data.sentAt,
          viewedAt: data.viewedAt,
          acceptedAt: data.acceptedAt,
          rejectedAt: data.rejectedAt,
          candidateSignatureUrl: data.candidateSignatureUrl,
          candidateRemarks: data.candidateRemarks,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      throw new Error("Offer not found");
    }

    return this.toDomain(updated);
  }


  async findById(id: string): Promise<Offer | null> {
    if (!this.isValidObjectId(id)) {
      return null;
    }

    const doc = await OfferModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      isDeleted: false,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findByOfferNumber(offerNumber: string): Promise<Offer | null> {
    const doc = await OfferModel.findOne({
      offerNumber,
      isDeleted: false,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<Offer | null> {
    if (!this.isValidObjectId(applicationId)) {
      return null;
    }

    const doc = await OfferModel.findOne({
      applicationId: new mongoose.Types.ObjectId(applicationId),
      isDeleted: false,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findByCandidateId(candidateId: string): Promise<Offer[]> {
    if (!this.isValidObjectId(candidateId)) {
      return [];
    }

    const docs = await OfferModel.find({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async findByRecruiterId(recruiterId: string): Promise<Offer[]> {
    if (!this.isValidObjectId(recruiterId)) {
      return [];
    }

    const docs = await OfferModel.find({
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async existsByApplicationId(applicationId: string): Promise<boolean> {
    if (!this.isValidObjectId(applicationId)) {
      return false;
    }

    const exists = await OfferModel.exists({
      applicationId: new mongoose.Types.ObjectId(applicationId),
      isDeleted: false,
    });

    return !!exists;
  }
  async findExpiredOffers(currentDate: Date): Promise<Offer[]> {
    const docs = await OfferModel.find({
      expiryDate: { $lt: currentDate },
      status: {
        $in: [OfferStatus.DRAFT, OfferStatus.SENT, OfferStatus.VIEWED],
      },
      isDeleted: false,
    }).sort({
      expiryDate: 1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async softDelete(id: string): Promise<void> {
    if (!this.isValidObjectId(id)) {
      return;
    }

    await OfferModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
      $set: {
        isDeleted: true,
      },
    });
  }

  private toDomain(doc: OfferDocument): Offer {
    return Offer.rehydrate({
      id: doc._id.toString(),
      offerNumber: doc.offerNumber,
      applicationId: doc.applicationId.toString(),
      jobId: doc.jobId.toString(),
      candidateId: doc.candidateId.toString(),
      recruiterId: doc.recruiterId.toString(),
      companyName: doc.companyName,
      jobTitle: doc.jobTitle,
      annualCTC: doc.annualCTC,
      currency: doc.currency as Currency,
      department: doc.department,
      workLocation: doc.workLocation,
      joiningDate: doc.joiningDate,
      probationPeriod: doc.probationPeriod,
      benefits: [...doc.benefits],
      notes: doc.notes,
      offerDate: doc.offerDate,
      expiryDate: doc.expiryDate,
      status: doc.status as OfferStatus,
      offerLetterUrl: doc.offerLetterUrl,
      contactEmail: doc.contactEmail,
      contactPhone: doc.contactPhone,
      sentAt: doc.sentAt,
      viewedAt: doc.viewedAt,
      acceptedAt: doc.acceptedAt,
      rejectedAt: doc.rejectedAt,
      candidateSignatureUrl: doc.candidateSignatureUrl,
      candidateRemarks: doc.candidateRemarks,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toPersistence(offer: Offer) {
    const data = offer.toObject();

    return {
      offerNumber: data.offerNumber,
      applicationId: new mongoose.Types.ObjectId(data.applicationId),
      jobId: new mongoose.Types.ObjectId(data.jobId),
      candidateId: new mongoose.Types.ObjectId(data.candidateId),
      recruiterId: new mongoose.Types.ObjectId(data.recruiterId),
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      annualCTC: data.annualCTC,
      currency: data.currency,
      department: data.department,
      workLocation: data.workLocation,
      joiningDate: data.joiningDate,
      probationPeriod: data.probationPeriod,
      benefits: data.benefits,
      notes: data.notes,
      offerDate: data.offerDate,
      expiryDate: data.expiryDate,
      status: data.status,
      offerLetterUrl: data.offerLetterUrl,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      sentAt: data.sentAt,
      viewedAt: data.viewedAt,
      acceptedAt: data.acceptedAt,
      rejectedAt: data.rejectedAt,
      candidateSignatureUrl: data.candidateSignatureUrl,
      candidateRemarks: data.candidateRemarks,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
