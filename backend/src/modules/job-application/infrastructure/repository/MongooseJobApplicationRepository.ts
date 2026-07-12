import mongoose from "mongoose";

import {
  ApplicationAIAnalysis as DomainApplicationAIAnalysis,
  ApplicationRecommendation,
  JobApplication,
  ApplicationAnalysisStatus,
  ApplicationStatus,
} from "../../domain/entity/job-application.entity";

import {
  CandidateApplicationListItem,
  JobApplicationRepository,
  RecruiterApplicationDetailsOutput,
  RecruiterApplicationListItem,
  RecruiterApplicationsQuery,
  RecruiterApplicationsResult,
  RecruiterInterviewApplication,
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

  async findAll(): Promise<JobApplication[]> {
    const docs = await JobApplicationModel.find({
      isDeleted: false,
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
        applicationNumber: doc.applicationNumber,
        jobId: job._id.toString(),
        jobTitle: job.title,
        resumeId: resume._id.toString(),
        resumeFileName: resume.fileName,
        status: doc.status,
        appliedAt: doc.appliedAt,
      };
    });
  }

async findRecruiterApplications(
  query: RecruiterApplicationsQuery,
): Promise<RecruiterApplicationsResult> {
  if (!this.isValidObjectId(query.recruiterId)) {
    return {
      applications: [],
      total: 0,
    };
  }

  const {
    recruiterId,
    page,
    limit,
    search,
    status,
    recommendation,
    sortBy = "appliedAt",
    sortOrder = "desc",
  } = query;

  const filter: any = {
    recruiterId: new mongoose.Types.ObjectId(recruiterId),
    isDeleted: false,
  };

  if (status) {
    filter.status = status;
  }

  if (recommendation) {
    filter["aiAnalysis.recommendation"] = recommendation;
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const docs = await JobApplicationModel.find(filter)
    .populate({
      path: "candidateId",
      select: "fullName email profileImage",
      match: search
        ? {
            $or: [
              { fullName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {},
    })
    .populate({
      path: "jobId",
      select: "title",
    })
    .populate({
      path: "resumeId",
      select: "fileName",
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  const applications = docs
    .filter((doc) => Boolean(doc.candidateId))
    .map((doc) => {
      const candidate = doc.candidateId as PopulatedCandidate;
      const job = doc.jobId as unknown as PopulatedJob;
      const resume = doc.resumeId as unknown as PopulatedResume;

      return {
        applicationId: doc._id.toString(),
        applicationNumber: doc.applicationNumber,
        candidateId: candidate._id.toString(),
        candidateName: candidate.fullName ?? "Unknown Candidate",
        candidateEmail: candidate.email ?? "",
        candidateProfileImage: candidate.profileImage,
        Jobtitle: job.title,
        resumeId: resume._id.toString(),
        fileName: resume.fileName,
        status: doc.status,
        aiScore: doc.aiAnalysis?.overallScore,
        aiRecommendation:
          doc.aiAnalysis?.recommendation as ApplicationRecommendation,
        appliedAt: doc.appliedAt,
   
      };
    });

  const total = await JobApplicationModel.countDocuments(filter);

  return {
    applications,
    total,
  };
}

  async findByRecruiterAndStatuses(
    recruiterId: string,
    statuses: ApplicationStatus[],
  ): Promise<JobApplication[]> {
    const docs = await JobApplicationModel.find({
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
      status: { $in: statuses },
      isDeleted: false,
    }).sort({
      appliedAt: -1,
    });

    return docs.map((doc) => this.toDomain(doc));
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
          applicationNumber: doc.applicationNumber,
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
      applicationNumber: doc.applicationNumber,
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
      applicationNumber: doc.applicationNumber,
      jobId: doc.jobId.toString(),
      candidateId: doc.candidateId.toString(),
      recruiterId: doc.recruiterId.toString(),
      resumeId: doc.resumeId.toString(),
      coverLetter: doc.coverLetter,
      status: doc.status,
      aiAnalysis: this.mapAIAnalysis(doc.aiAnalysis),
      analysisStatus: doc.analysisStatus as ApplicationAnalysisStatus,
      rejectionReason: doc.rejectionReason,
      appliedAt: doc.appliedAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toPersistence(application: JobApplication) {
    const data = application.toObject();

    return {
      applicationNumber: data.applicationNumber,
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
  async findRecruiterInterviewApplications(
    recruiterId: string,
    statuses: ApplicationStatus[],
  ): Promise<RecruiterInterviewApplication[]> {
    const applications = await JobApplicationModel.find({
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
      status: { $in: statuses },
    })
      .populate({
        path: "candidateId",
        select: "fullName email profileImage",
      })
      .populate({
        path: "jobId",
        select: "title",
      })
      .lean();

    return applications.map((app: any) => ({
      applicationId: app._id.toString(),
      applicationNumber: app.applicationNumber,
      jobId: app.jobId._id.toString(),
      jobTitle: app.jobId.title,
      candidateId: app.candidateId._id.toString(),
      candidateName: app.candidateId.fullName,
      candidateEmail: app.candidateId.email,
      candidateProfileImage: app.candidateId.profileImage,
      recruiterId: app.recruiterId.toString(),

      status: app.status,
    }));
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
