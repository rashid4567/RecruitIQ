import api from "@/api/axios";
import type { UserRepositry } from "../../domain/repositories/user.Repository";

export class ApiUserRepository implements UserRepositry {
  async blockUser(userId: string): Promise<void> {
    await api.patch(`/admin/${userId}/block`);
  }

  async unblockUser(userId: string): Promise<void> {
    await api.patch(`/admin/${userId}/unblock`);
  }
}
