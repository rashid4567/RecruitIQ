import { userRoles } from "../../domain/constants/roles.constants";

export interface CreateProfileRequest {
  userId: string;
  role: userRoles;
}
