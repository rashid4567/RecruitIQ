import mongoose from "mongoose";

import {
  ApplicationAIAnalysis as DomainApplicationAIAnalysis,
  ApplicationRecommendation,
  JobApplication,
  ApplicationAnalysisStatus,
} from "../../domain/entity/job-application.entity";

import {
  CandidateApplicationListItem,
  JobApplicationRepository,
  RecruiterApplicationDetailsOutput,
  RecruiterApplicationListItem,
} from "../../domain/repository/job-application.repository";

import {
  ApplicationAIAnalysis as PersistenceApplicationAIAnalysis,
  JobApplicationDocument,
  JobApplicationModel,
} from "../mongoose/job-application.model";

interface PopulatedCandidate {
  _id: mongoose.Types.ObjectId;
  fullName?: string;
  email?: string;
  profileImage?: string;
}

interface PopulatedJob {
  _id: mongoose.Types.ObjectId;
  title: string;
}

interface PopulatedResume {
  _id: mongoose.Types.ObjectId;
  fileName: string;
}

export class MongooseJobApplicationRepository implements JobApplicationRepository {
  async create(application: JobApplication): Promise<JobApplication> {
    const created = await JobApplicationModel.create(
      this.toPersistence(application),
    );

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
          analysisStatus: data.analysisStatus,
          aiAnalysis: data.aiAnalysis,
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await JobApplicationModel.findOne({
      _id: id,
      isDeleted: false,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findByJob(jobId: string): Promise<JobApplication[]> {
    if (!this.isValidObjectId(jobId)) {
      return [];
    }

    const docs = await JobApplicationModel.find({
      jobId: new mongoose.Types.ObjectId(jobId),
      isDeleted: false,
    }).sort({
      appliedAt: -1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }
  async findApplicationsForCandidate(
    candidateId: string,
  ): Promise<CandidateApplicationListItem[]> {
    const docs = await JobApplicationModel.find({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      isDeleted: false,
    })
      .populate({
        path: "jobId",
        select: "title",
      })
      .populate({
        path: "resumeId",
        select: "fileName",
      })
      .sort({
        createdAt: -1,
      });

    return docs.map((doc) => {
      const job = doc.jobId as unknown as PopulatedJob;
      const resume = doc.resumeId as unknown as PopulatedResume;

      return {
        applicationId: doc._id.toString(),
        jobId: job._id.toString(),
        jobTitle: job.title,
        resumeId: resume._id.toString(),
        resumeFileName: resume.fileName,
        status: doc.status,
        appliedAt: doc.appliedAt,
      };
    });
  }

  async findApplicationsWithCandidateDetails(
    jobId: string,
  ): Promise<RecruiterApplicationListItem[]> {
    if (!this.isValidObjectId(jobId)) {
      return [];
    }

    const docs = await JobApplicationModel.find({
      jobId: new mongoose.Types.ObjectId(jobId),
      isDeleted: false,
    })
      .populate({
        path: "candidateId",
        select: "fullName email profileImage",
      })
      .populate({
        path: "jobId",
        select: "title",
      })
      .populate({
        path: "resumeId",
        select: "fileName",
      })
      .sort({
        appliedAt: -1,
      });

      

      docs.forEach((doc) => {
  console.log("APPLICATION:", doc._id.toString());
  console.log("resumeId:", doc.resumeId);
});

    return docs
      .filter((doc) => Boolean(doc.candidateId))
      .map((doc) => {
        const candidate = doc.candidateId as PopulatedCandidate;
        const job = doc.jobId as unknown as PopulatedJob;
        const resume = doc.resumeId as unknown as PopulatedResume;

        return {
          applicationId: doc._id.toString(),
          candidateId: candidate._id.toString(),
          candidateName: candidate.fullName ?? "Unknown Candidate",
          candidateEmail: candidate.email ?? "",
          candidateProfileImage: candidate.profileImage,
          Jobtitle: job.title,
          fileName: resume.fileName,
          resumeId: doc.resumeId.toString(),
          status: doc.status,
          aiScore: doc.aiAnalysis?.overallScore,
          aiRecommendation: doc.aiAnalysis
            ?.recommendation as ApplicationRecommendation,
          analysisStatus: doc.analysisStatus as ApplicationAnalysisStatus,
          appliedAt: doc.appliedAt,
          interview: doc.interview
            ? {
                scheduledAt: doc.interview.scheduledAt,
                location: doc.interview.location,
                meetingLink: doc.interview.meetingLink,
                notes: doc.interview.notes,
              }
            : undefined,
        };
      });
      
  }

  async findApplicationDetailsForRecruiter(
    applicationId: string,
  ): Promise<RecruiterApplicationDetailsOutput | null> {
    if (!this.isValidObjectId(applicationId)) {
      return null;
    }

    const doc = await JobApplicationModel.findOne({
      _id: new mongoose.Types.ObjectId(applicationId),
      isDeleted: false,
    }).populate({
      path: "candidateId",
      select: "fullName email profileImage",
    });

    if (!doc || !doc.candidateId) {
      return null;
    }

    const candidate = doc.candidateId as PopulatedCandidate;

    return {
      applicationId: doc._id.toString(),
      jobId: doc.jobId.toString(),
      candidateId: candidate._id.toString(),
      recruiterId: doc.recruiterId.toString(),
      resumeId: doc.resumeId.toString(),
      candidateName: candidate.fullName ?? "Unknown Candidate",
      candidateEmail: candidate.email ?? "",
      candidateProfileImage: candidate.profileImage,
      coverLetter: doc.coverLetter,
      status: doc.status,
      analysisStatus: doc.analysisStatus as ApplicationAnalysisStatus,
      aiAnalysis: this.mapAIAnalysis(doc.aiAnalysis),
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
    };
  }

  async findByCandidate(candidateId: string): Promise<JobApplication[]> {
    if (!this.isValidObjectId(candidateId)) {
      return [];
    }

    const docs = await JobApplicationModel.find({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      isDeleted: false,
    }).sort({
      appliedAt: -1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async findByRecruiter(recruiterId: string): Promise<JobApplication[]> {
    if (!this.isValidObjectId(recruiterId)) {
      return [];
    }
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
    if (!this.isValidObjectId(candidateId) || !this.isValidObjectId(jobId)) {
      return null;
    }

    const doc = await JobApplicationModel.findOne({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      jobId: new mongoose.Types.ObjectId(jobId),
      isDeleted: false,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findByResumeId(resumeId: string): Promise<JobApplication[]> {
    const docs = await JobApplicationModel.find({
      resumeId: new mongoose.Types.ObjectId(resumeId),
      isDeleted: false,
    });
    return docs.map((doc) => this.toDomain(doc));
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
      aiAnalysis: this.mapAIAnalysis(doc.aiAnalysis),
      interview: doc.interview
        ? {
            scheduledAt: doc.interview.scheduledAt,
            location: doc.interview.location,
            meetingLink: doc.interview.meetingLink,
            notes: doc.interview.notes,
          }
        : undefined,
      analysisStatus: doc.analysisStatus as ApplicationAnalysisStatus,
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
      analysisStatus: data.analysisStatus,
      interview: data.interview,
      rejectionReason: data.rejectionReason,
      aiAnalysis: data.aiAnalysis,
      appliedAt: data.appliedAt,
      updatedAt: data.updatedAt,
    };
  }
  async countTodayApplicationsByCandidate(
    candidateId: string,
  ): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await JobApplicationModel.countDocuments({
      candidateId: new mongoose.Types.ObjectId(candidateId),
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
  }

  async findByAnalysisStatus(
    recruiterId: string,
    status: ApplicationAnalysisStatus,
  ): Promise<JobApplication[]> {
    if (!this.isValidObjectId(recruiterId)) {
      return [];
    }

    const docs = await JobApplicationModel.find({
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
      analysisStatus: status,
      isDeleted: false,
    }).sort({
      appliedAt: -1,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  private mapAIAnalysis(
    aiAnalysis?: PersistenceApplicationAIAnalysis,
  ): DomainApplicationAIAnalysis | undefined {
    if (!aiAnalysis) {
      return undefined;
    }

    return {
      overallScore: aiAnalysis.overallScore,
      requiredSkillsScore: aiAnalysis.requiredSkillsScore,
      preferredSkillsScore: aiAnalysis.preferredSkillsScore,
      experienceScore: aiAnalysis.experienceScore,
      requirementsScore: aiAnalysis.requirementsScore,
      educationScore: aiAnalysis.educationScore,
      strengths: aiAnalysis.strengths,
      gaps: aiAnalysis.gaps,
      missingCriticalSkills: aiAnalysis.missingCriticalSkills,
      recommendation: aiAnalysis.recommendation as ApplicationRecommendation,
      summary: aiAnalysis.summary,
      analyzedAt: aiAnalysis.analyzedAt,
    };
  }

  private isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
