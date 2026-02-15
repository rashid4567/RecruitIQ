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
  (error) => Promise.reject(error),
);

function clearAuthAndRedirect(path: string, message?: string) {
  if (message) toast.error(message);

  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");

  window.location.href = path;
}

api.interceptors.response.use(
  (response) => {
    const message = response?.data?.message;

    if (message && response.config.method !== "get") {
      toast.success(message);
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (!error.response) {
      toast.error("Network error. Please check your internet connection.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const code = error.response.data?.code;
    const message = error.response.data?.message || "Something went wrong";

    if (originalRequest?.url?.includes("/auth/refresh")) {
      clearAuthAndRedirect("/signin", message);
      return Promise.reject(error);
    }

    if (status === 401 && code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshRes.data?.data?.accessToken;

        if (!newAccessToken) throw new Error();

        localStorage.setItem("authToken", newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        clearAuthAndRedirect("/signin", "Session expired. Please login again.");
        return Promise.reject(error);
      }
    }

    if (status === 403 && code === "ACCOUNT_DEACTIVATED") {
      clearAuthAndRedirect("/account-deactivated", message);
      return Promise.reject(error);
    }

    if (status === 401) {
      clearAuthAndRedirect("/signin", message);
      return Promise.reject(error);
    }

    if (status === 404) {
      toast.error(message || "Requested resource not found");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
