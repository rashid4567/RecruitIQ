import { userRoles } from "../../domain/constants/roles.constants";

export interface GoogleLoginRequestDTO {
  credential: string;
  role?: userRoles;
}