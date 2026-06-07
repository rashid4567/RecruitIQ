import mongoose from "mongoose";

import { JobApplication } from "../../domain/entity/job-application.entity";
import {
  JobApplicationRepository,
  RecruiterApplicationListItem,
} from "../../domain/repository/job-application.repository";

import {
  JobApplicationDocument,
  JobApplicationModel,
} from "../mongoose/job-application.model";

export class MongooseJobApplicationRepository implements JobApplicationRepository {
  async create(application: JobApplication): Promise<JobApplication> {
    const created = await JobApplicationModel.create({
      ...this.toPersistence(application),
    });

    return this.toDomain(created);
  }

  async save(application: JobApplication): Promise<JobApplication> {
    const data = application.toObject();

    const updated = await JobApplicationModel.findByIdAndUpdate(
      data.id,
      {
        $set: {
          status: data.status,
          interview: data.interview,
          rejectionReason: data.rejectionReason,
          updatedAt: data.updatedAt,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      throw new Error("Job application not found");
    }

    return this.toDomain(updated);
  }

  async findById(id: string): Promise<JobApplication | null> {
    const doc = await JobApplicationModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByJob(jobId: string): Promise<JobApplication[]> {
    const docs = await JobApplicationModel.find({
      jobId: new mongoose.Types.ObjectId(jobId),
      isDeleted: false,
    }).sort({
      appliedAt: -1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async findApplicationsWithCandidateDetails(
  jobId: string,
): Promise<RecruiterApplicationListItem[]> {
  const docs = await JobApplicationModel.find({
    jobId: new mongoose.Types.ObjectId(jobId),
    isDeleted: false,
  })
    .populate({
      path: "candidateId",
      select: "fullName email profileImage",
    })
    .sort({
      appliedAt: -1,
    });

  return docs
    .filter((doc: any) => doc.candidateId)
    .map((doc: any) => ({
      applicationId: doc._id.toString(),
      candidateId: doc.candidateId._id.toString(),
      candidateName: doc.candidateId.fullName ?? "Unknown Candidate",
      candidateEmail: doc.candidateId.email ?? "",
      candidateProfileImage: doc.candidateId.profileImage,
      resumeId: doc.resumeId.toString(),
      status: doc.status,
      appliedAt: doc.appliedAt,
      interview: doc.interview
        ? {
            scheduledAt: doc.interview.scheduledAt,
            location: doc.interview.location,
            meetingLink: doc.interview.meetingLink,
            notes: doc.interview.notes,
          }
        : undefined,
    }));
}

  async findByCandidate(candidateId: string): Promise<JobApplication[]> {
    const docs = await JobApplicationModel.find({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      isDeleted: false,
    }).sort({
      appliedAt: -1,
    });
    return docs.map((doc) => this.toDomain(doc));
  }

  async findByRecruiter(recruiterId: string): Promise<JobApplication[]> {
    const docs = await JobApplicationModel.find({
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
      isDeleted: false,
    }).sort({
      appliedAt: -1,
    });
    return docs.map((doc) => this.toDomain(doc));
  }

  async findExistingApplication(
    candidateId: string,
    jobId: string,
  ): Promise<JobApplication | null> {
    const doc = await JobApplicationModel.findOne({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      jobId: new mongoose.Types.ObjectId(jobId),
      isDeleted: false,
    });

    return doc ? this.toDomain(doc) : null;
  }

  private toDomain(doc: JobApplicationDocument): JobApplication {
    return JobApplication.rehydrate({
      id: doc._id.toString(),
      jobId: doc.jobId.toString(),
      candidateId: doc.candidateId.toString(),
      recruiterId: doc.recruiterId.toString(),
      resumeId: doc.resumeId.toString(),
      coverLetter: doc.coverLetter,
      status: doc.status,
      interview: doc.interview
        ? {
            scheduledAt: doc.interview.scheduledAt,
            location: doc.interview.location,
            meetingLink: doc.interview.meetingLink,
            notes: doc.interview.notes,
          }
        : undefined,
      rejectionReason: doc.rejectionReason,
      appliedAt: doc.appliedAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toPersistence(application: JobApplication) {
    const data = application.toObject();

    return {
      jobId: new mongoose.Types.ObjectId(data.jobId),
      candidateId: new mongoose.Types.ObjectId(data.candidateId),
      recruiterId: new mongoose.Types.ObjectId(data.recruiterId),
      resumeId: new mongoose.Types.ObjectId(data.resumeId),
      coverLetter: data.coverLetter,
      status: data.status,
      interview: data.interview,
      rejectionReason: data.rejectionReason,
      appliedAt: data.appliedAt,
      updatedAt: data.updatedAt,
    };
  }
}
