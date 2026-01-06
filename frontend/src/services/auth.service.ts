import api from "../api/axios";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export const authService = {
  sendCandidateOtp: async (email: string) => {
    const res = await api.post("/auth/candidate/send-otp", { email });
    return res.data;
  },

  verifyCandidate: async (data: {
    email: string;
    otp: string;
    password: string;
    fullName: string;
  }) => {
    const res = await api.post("/auth/candidate/register", data);

   
    const accessToken = res.data.data.accessToken;
    const user = res.data.data.user;
    
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id); 

    return res.data;
  },

  registerRecruiter: async (payload: RegisterPayload) => {
    const res = await api.post("/auth/recruiter/register", {
      ...payload,
      role: "recruiter",
    });

    const accessToken = res.data.data.accessToken;
    const user = res.data.data.user;
    
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id); // ⚠️ ADD THIS LINE!

    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    const accessToken = res.data.data.accessToken;
    const user = res.data.data.user;
    
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id); // ⚠️ ADD THIS LINE!

    return res.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId"); // ⚠️ ADD THIS LINE!
  },
};