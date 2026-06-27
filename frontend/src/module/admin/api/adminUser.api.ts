import api from "@/api/axios";

export const blockUser = async (
  userId: string,
): Promise<void> => {
  await api.patch(`/admin/${userId}/block`);
};

export const unblockUser = async (
  userId: string,
): Promise<void> => {
  await api.patch(`/admin/${userId}/unblock`);
};