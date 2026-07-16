import { userRoles } from "../../domain/constants/roles.constants";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;

  user: {
    id: string;
    role: userRoles;
    fullName?: string;
    profileImage?: string;
  };

  isFirstLogin: boolean;
  profileCompleted: boolean;
}