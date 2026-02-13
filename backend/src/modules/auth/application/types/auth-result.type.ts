import { userRoles } from "../../domain/constants/roles.constants";

export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: userRoles;
};