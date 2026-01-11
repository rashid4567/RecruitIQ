import axios, { type AxiosRequestConfig } from "axios";
import { toast } from "sonner";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    const status = error.response?.status;
    const code = error.response?.data?.code;
    const message = error.response?.data?.message || "Something went wrong";

    console.error("❌ Axios error:", {
      url: originalRequest?.url,
      status,
      code,
      message,
    });

    if (originalRequest?.url?.includes("/auth/refresh")) {
      forceLogout(message);
      return Promise.reject(error);
    }

    if (status === 401 && code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh returned no token");
        }

        localStorage.setItem("authToken", newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        forceLogout("Session expired. Please login again.");
        return Promise.reject(error);
      }
    }

    if (status === 401) {
      toast.error(message);
      forceLogout();
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error(message);
      forceLogout();
      return Promise.reject(error);
    }

    if (status === 404) {
      toast.error("Requested resource not found");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

function forceLogout(message?: string) {
  if (message) toast.error(message);

  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");

  if (!window.location.pathname.includes("/signin")) {
    window.location.href = "/signin";
  }
}

export default api;

