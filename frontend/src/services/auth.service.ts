import api from "../api/axios";
import { googleService } from "./google.service";

export const authService = {
  sendOTP: async (email: string, role: "candidate" | "recruiter") => {
    const res = await api.post("/auth/send-otp", { email, role });
    return res.data;
  },

  verifyOtpAndRegister: async (data: {
    email: string;
    otp: string;
    password: string;
    fullName: string;
    role: "candidate" | "recruiter";
  }) => {
    const res = await api.post("/auth/verify-otp", data);

    const accessToken = res.data.data.accessToken;
    const user = res.data.data.user;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);

    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    const accessToken = res.data.data.accessToken;
    const user = res.data.data.user;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);

    return res.data;
  },

  googleLogin: googleService.googleLogin,

  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  },
};
