import { deleteResumeUseCase } from "../../application/usecase/delete.resume.usecase";
import { DownloadResumeUseCase } from "../../application/usecase/download.resume.usecase";
import { getMyResumeUseCase } from "../../application/usecase/getResume.usecase";
import { UploadResumeUseCase } from "../../application/usecase/upload.resume.Usecase";
import type { ResumeRepository } from "../../domain/repository/ResumeRepository";
import { ApiResumeRepository } from "../../infrastructure/repository/ResumeRepositoryImpl";

const repo : ResumeRepository = new ApiResumeRepository();
export const uploadResumeUC = new UploadResumeUseCase(repo);
export const getMyResumeUC = new getMyResumeUseCase(repo);
export const downloadResumeUC = new DownloadResumeUseCase(repo);
export const deleteResumeUC = new deleteResumeUseCase(repo);
