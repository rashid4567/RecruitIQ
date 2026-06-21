import { useEffect, useState } from "react";
import {
  JobApplication,
  ApplicationAnalysisStatus,
} from "@/module/job-application/domain/entity/job-application.entity";
import { getMyApplicationsUC } from "../../di/application.di";

export const useMyApplicatons = () => {
  const [application, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplication = async () => {
    try {
      const result = await getMyApplicationsUC.execute();

      const entities = result.map((dto) =>
        JobApplication.create({
          id: dto.applicationId,
          jobId: dto.jobId,
          jobTitle: dto.jobTitle,
          resumeId: dto.resumeId,
          resumeFileName: dto.resumeFileName,
          status: dto.status,
          analysisStatus: ApplicationAnalysisStatus.PENDING,
          appliedAt: dto.appliedAt,
          updatedAt: dto.appliedAt,
          candidateId: "",
          recruiterId: "",
        }),
      );

      setApplications(entities);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, []);

  return { application, loading, error, refresh: loadApplication };
};
