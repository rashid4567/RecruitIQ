import api from "../../api/axios";

export const googleService = {
  googleLogin: async (
    credential: string,
    role?: "candidate" | "recruiter"
  ) => {
    const payload: any = { credential };
    if (role) payload.role = role;

    const res = await api.post("/auth/google/login", payload);

    const accessToken = res.data.data.accessToken;
    const user = res.data.data.user;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);

    return res.data;
  },
};
