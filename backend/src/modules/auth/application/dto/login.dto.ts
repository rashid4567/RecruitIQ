import { UserRole } from "../../infrastructure/mongoose/model/user.model";

export interface LoginRequestDTO {
  email: string;
  password: string;
  requiredRole?: UserRole;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: UserRole;
    fullName?: string;
    profileImage?: string;
  };
  profileCompleted: boolean;
  isFirstLogin: boolean;
}