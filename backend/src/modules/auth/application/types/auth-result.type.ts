import { userRoles } from "../../domain/constants/roles.constants";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: userRoles;
  fullName?: string; 
}