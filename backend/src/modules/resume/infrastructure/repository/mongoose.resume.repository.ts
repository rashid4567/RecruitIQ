import { ParsedResumeData, Resume } from "../../domain/entity/resume.entity";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { ResumeModel } from "../mongoose/resume.model";

export class MongooseResumeRepository implements ResumeRepository {
  async create(resume: Resume): Promise<Resume> {
    const doc = await ResumeModel.create({
      candidateId: resume.getCandidateId(),
      fileName: resume.getFileName(),
      fileKey: resume.getFileKey(),
      uploadedAt: resume.getUploadedAt(),
      parsedData: resume.getParsedData(),
    });

    return Resume.fromPersistence({
      id: doc._id.toString(),
      candidateId: doc.candidateId.toString(),
      fileName: doc.fileName,
      fileKey: doc.fileKey,
      uploadedAt: doc.uploadedAt,
      parsedData: doc.parsedData ?? undefined,
    });
  }

  async update(resume: Resume): Promise<Resume> {
    const doc = await ResumeModel.findByIdAndUpdate(
      resume.getId(),
      {
        $set: {
          fileName: resume.getFileName(),
          fileKey: resume.getFileKey(),
          uploadedAt: resume.getUploadedAt(),
          parsedData: resume.getParsedData(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!doc) {
      throw new Error("Resume not found");
    }

    return Resume.fromPersistence({
      id: doc._id.toString(),
      candidateId: doc.candidateId.toString(),
      fileName: doc.fileName,
      fileKey: doc.fileKey,
      uploadedAt: doc.uploadedAt,
      parsedData: doc.parsedData ?? undefined,
    });
  }

  async findByCandidateId(candidateId: string): Promise<Resume | null> {
    const doc = await ResumeModel.findOne({
      candidateId,
    }).lean();

    if (!doc) {
      return null;
    }

    return Resume.fromPersistence({
      id: doc._id.toString(),
      candidateId: doc.candidateId.toString(),
      fileName: doc.fileName,
      fileKey: doc.fileKey,
      uploadedAt: doc.uploadedAt,
      parsedData: doc.parsedData ?? undefined,
    });
  }

  async updateParsedData(resumeId: string, parsedData: ParsedResumeData): Promise<void> {
    await ResumeModel.findByIdAndUpdate(
      resumeId,
      {
        $set : {
          parsedData,
        },
      },
      {
        runValidators :true,
      }
    )
  }

  async findById(id: string): Promise<Resume | null> {
    const doc = await ResumeModel.findById(id).lean();

    if (!doc) {
      return null;
    }

    return Resume.fromPersistence({
      id: doc._id.toString(),
      candidateId: doc.candidateId.toString(),
      fileName: doc.fileName,
      fileKey: doc.fileKey,
      uploadedAt: doc.uploadedAt,
      parsedData: doc.parsedData ?? undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await ResumeModel.findByIdAndDelete(id);
  }
}
