import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import type { JobApplication } from "../../../../domain/entity/job-application.entity";
import { getStatusConfig } from "./Statusconfig";
import { JobIdentityCard } from "./Jobidentitycard";
import { StatsGrid } from "./Statsgrid";
import { ApplicationMetaCard } from "./Applicationmetacard";
import { ActionButtons } from "./Actionbuttons";

interface LeftPanelProps {
  job: Job;
  application: JobApplication;
  statusCfg: ReturnType<typeof getStatusConfig>;
  currentStep: number;
  onWithdraw: () => void;
  downloadResume: (resumeId: string) => Promise<boolean>;
  downloadLoading: boolean;
}

export function LeftPanel({
  job,
  application,
  statusCfg,
  onWithdraw,
  downloadResume,
  downloadLoading,
}: LeftPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <JobIdentityCard job={job} application={application} statusCfg={statusCfg} />
      <StatsGrid job={job} />
      <ApplicationMetaCard application={application} job={job} />
      <ActionButtons
        application={application}
        onWithdraw={onWithdraw}
        downloadResume={downloadResume}
        downloadLoading={downloadLoading}
      />
    </div>
  );
}