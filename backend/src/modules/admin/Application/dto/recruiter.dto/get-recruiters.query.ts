import { verificationStatus } from "../../../../recruiter/domain/constatns/verificationStatus.constants"; 

export interface RecruiterListItemDTO {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
  verificationStatus: string;
  subscriptionStatus?: string;
  joinedDate?: Date;
}
export interface GetRecruitersQuery {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: verificationStatus;
  subscriptionStatus?: string;
  isActive?: boolean;
  sort?: "latest" | "oldest";
}


export interface GetRecruitersResponseDTO {
  recruiters: RecruiterListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}