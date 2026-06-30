import mongoose from "mongoose";
import { InterviewRepository } from "../../domain/repository/interview.repository";
import { Interview } from "../../domain/entity/interview.entity";
import {
  InterviewDocument,
  InterviewModel,
  InterviewStatus,
} from "../mongoose/interview.model";
export class MongooseInterviewRepository implements InterviewRepository {
  async create(interview: Interview): Promise<Interview> {
    const created = await InterviewModel.create(this.toPersistence(interview));
    return this.toDomain(created);
  }

  async save(interview: Interview): Promise<Interview> {
    const data = interview.toObject();

    const updated = await InterviewModel.findByIdAndUpdate(
      data.id,
      {
        $set: {
          applicationId: new mongoose.Types.ObjectId(data.applicationId),
          jobId: new mongoose.Types.ObjectId(data.jobId),
          candidateId: new mongoose.Types.ObjectId(data.candidateId),
          recruiterId: new mongoose.Types.ObjectId(data.recruiterId),
          round: data.round,
          title: data.title,
          description: data.description,
          mode: data.mode,
          status: data.status,
          scheduledAt: data.scheduledAt,
          durationInMinutes: data.durationInMinutes,
          location: data.location,
          roomId: data.roomId,
          meetingLink: data.meetingLink,
          startedAt: data.startedAt,
          endedAt: data.endedAt,
          recruiterJoinedAt: data.recruiterJoinedAt,
          candidateJoinedAt: data.candidateJoinedAt,
          notes: data.notes,
          cancelledReason: data.cancelledReason,
          cancelledBy:
            data.cancelledBy &&
            mongoose.Types.ObjectId.isValid(data.cancelledBy)
              ? new mongoose.Types.ObjectId(data.cancelledBy)
              : undefined,
          reminderSent: data.reminderSent,
          updatedAt: data.updatedAt,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updated) {
      throw new Error("Interview not found");
    }
    return this.toDomain(updated);
  }

  async findById(id: string): Promise<Interview | null> {
    if (!this.isValidObjectId(id)) {
      return null;
    }
    const doc = await InterviewModel.findById(id);

    return doc ? this.toDomain(doc) : null;
  }

  async findByApplicationId(applicationId: string): Promise<Interview | null> {
    if (!this.isValidObjectId(applicationId)) {
      return null;
    }

    const doc = await InterviewModel.findOne({
      applicationId: new mongoose.Types.ObjectId(applicationId),
    }).sort({
      round: -1,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findByCandidate(
    candidateId: string,
    page = 1,
    limit = 10,
  ): Promise<Interview[]> {
    if (!this.isValidObjectId(candidateId)) {
      return [];
    }

    const skip = (page - 1) * limit;

    const docs = await InterviewModel.find({
      candidateId: new mongoose.Types.ObjectId(candidateId),
    })
      .sort({
        scheduledAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => this.toDomain(doc));
  }

  async findByRecruiter(
    recruiterId: string,
    page = 1,
    limit = 10,
  ): Promise<Interview[]> {
    if (!this.isValidObjectId(recruiterId)) {
      return [];
    }

    const skip = (page - 1) * limit;
    const docs = await InterviewModel.find({
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
    })
      .sort({
        scheduledAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => this.toDomain(doc));
  }

  async findByApplicationAndRound(
    applicationId: string,
    round: number,
  ): Promise<Interview | null> {
    if (!this.isValidObjectId(applicationId)) {
      return null;
    }

    const doc = await InterviewModel.findOne({
      applicationId: new mongoose.Types.ObjectId(applicationId),
      round,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findUpcomingByCandidate(candidateId: string): Promise<Interview[]> {
    if (!this.isValidObjectId(candidateId)) {
      return [];
    }

    const docs = await InterviewModel.find({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      status: {
        $in: [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED],
      },
    }).sort({ scheduledAt: 1 });
    return docs.map((doc) => this.toDomain(doc));
  }

  async findUpcomingByRecruiter(recruiterId: string): Promise<Interview[]> {
    if (!this.isValidObjectId(recruiterId)) {
      return [];
    }

    const docs = await InterviewModel.find({
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
      status: {
        $in: [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED],
      },
    }).sort({ scheduledAt: 1 });

    return docs.map((doc) => this.toDomain(doc));
  }
  async findScheduledInterviewsBefore(
    scheduledBefore: Date,
  ): Promise<Interview[]> {
    const docs = await InterviewModel.find({
      scheduledAt: {
        $lte: scheduledBefore,
      },
      status: {
        $in: [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED],
      },
      reminderSent: false,
    }).sort({
      scheduledAt: 1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async delete(id: string): Promise<void> {
    if (!this.isValidObjectId(id)) {
      return;
    }

    await InterviewModel.findByIdAndDelete(id);
  }
  private toDomain(doc: InterviewDocument): Interview {
    return Interview.rehydrate({
      id: doc._id.toString(),
      applicationId: doc.applicationId.toString(),
      jobId: doc.jobId.toString(),
      candidateId: doc.candidateId.toString(),
      recruiterId: doc.recruiterId.toString(),
      round: doc.round,
      title: doc.title,
      description: doc.description,
      mode: doc.mode,
      status: doc.status,
      scheduledAt: doc.scheduledAt,
      durationInMinutes: doc.durationInMinutes,
      location: doc.location,
      roomId: doc.roomId,
      meetingLink: doc.meetingLink,
      startedAt: doc.startedAt,
      endedAt: doc.endedAt,
      recruiterJoinedAt: doc.recruiterJoinedAt,
      candidateJoinedAt: doc.candidateJoinedAt,
      notes: doc.notes,
      cancelledReason: doc.cancelledReason,
      cancelledBy: doc.cancelledBy?.toString(),
      reminderSent: doc.reminderSent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  private toPersistence(interview: Interview) {
    const data = interview.toObject();

    return {
      applicationId: new mongoose.Types.ObjectId(data.applicationId),
      jobId: new mongoose.Types.ObjectId(data.jobId),
      candidateId: new mongoose.Types.ObjectId(data.candidateId),
      recruiterId: new mongoose.Types.ObjectId(data.recruiterId),
      round: data.round,
      title: data.title,
      description: data.description,
      mode: data.mode,
      status: data.status,
      scheduledAt: data.scheduledAt,
      durationInMinutes: data.durationInMinutes,
      location: data.location,
      roomId: data.roomId,
      meetingLink: data.meetingLink,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
      recruiterJoinedAt: data.recruiterJoinedAt,
      candidateJoinedAt: data.candidateJoinedAt,
      notes: data.notes,
      cancelledReason: data.cancelledReason,
      cancelledBy:
        data.cancelledBy && mongoose.Types.ObjectId.isValid(data.cancelledBy)
          ? new mongoose.Types.ObjectId(data.cancelledBy)
          : undefined,
      reminderSent: data.reminderSent,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
