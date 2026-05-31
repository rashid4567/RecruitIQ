import { JobFilters } from "../../domain/types/job-filter.type";
import { GetJobQueryDTO } from "../../presentation/dto/get-job-query.dto";

export class JobFilterMapper {
  static toDomain(query: GetJobQueryDTO): JobFilters {
    return {
      search: query.search,
      status: query.status as any,
      jobType: query.jobType as any,
      department: query.department,
      isRemote:
        query.isRemote === "true"
          ? true
          : query.isRemote === "false"
            ? false
            : undefined,
      isBlocked:
        query.isBlocked === "true"
          ? true
          : query.isBlocked === "false"
            ? false
            : undefined,
      salaryMin: query.salaryMin ? Number(query.salaryMin) : undefined,
      salaryMax: query.salaryMax ? Number(query.salaryMax) : undefined,
      requiredSkills: query.skills ? query.skills.split(",") : undefined,
    };
  }
}
