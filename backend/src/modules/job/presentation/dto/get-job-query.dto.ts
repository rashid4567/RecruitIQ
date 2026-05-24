export interface GetJobQueryDTO {
  page?: string;
  limit?: string;
  search?: string
  status?: string;
  jobType?: string;
  department?: string;
  isRemote?: string;
  isBlocked?: string;
  skills?: string;
  salaryMin?: string;
  salaryMax?: string;
}