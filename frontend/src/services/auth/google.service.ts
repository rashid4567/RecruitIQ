import api from "../../api/axios";
import type { GoogleLoginPayload } from "@/types/auth/google.types";

export const googleService = {
  googleLogin: async (
    credential: string,
    role?: "candidate" | "recruiter"
  ) => {
    const payload: GoogleLoginPayload = { credential };
    if (role) payload.role = role;

    const res = await api.post("/auth/google/login", payload);

    const { accessToken, role: userRole, userId } = res.data.data;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userId", userId);

    return res.data;
  },
};

