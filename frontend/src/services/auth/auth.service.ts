
import api from "../../api/axios";
import { googleService } from "./google.service";

export const authService = {
  sendOTP: async (email: string, role: "candidate" | "recruiter" | "admin") => {
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

    const { accessToken, user } = res.data.data;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);

    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    const { accessToken, user } = res.data.data;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);

    return res.data;
  },

  adminLogin: async (email: string, password: string) => {
    const res = await api.post("/auth/admin/login", { email, password });

    const { accessToken, user } = res.data.data;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);

    return res.data;
  },

  googleLogin: googleService.googleLogin,

  logout: async (redirect: boolean = true) => {
    try {
      await api.post("/auth/logout");
    } catch {
      console.warn("Logout request failed, continuing locally");
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");

      if (redirect) {
        window.location.href = "/signin";
      }
    }
  },

  forgotPassword : async (email : string) =>{
    const res = await api.post("/auth/forgot-password",{email});
    return res.data;
  },
  resetPassword : async (token : string, newPassword :string) =>{
    const res = await api.post("/auth/reset-password",{
      token,
      newPassword,
    });

    return res.data;
  },

  updatePassword : async (payload : {
    currentPassword : string,
    newPassword : string,
  }) =>{
   await api.put("/auth/update-password",payload)

  }
};
