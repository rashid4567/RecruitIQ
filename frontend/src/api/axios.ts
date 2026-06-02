import axios, { type AxiosRequestConfig } from "axios";
import { toast } from "sonner";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
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

  (error) => {
    return Promise.reject(error);
  },
);

function clearAuthAndRedirect(path: string, message?: string) {
  if (message) {
    toast.error(message);
  }

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
      toast.error("Network error. Check internet connection.");

      return Promise.reject(error);
    }

    const status = error.response.status;

    const code = error.response.data?.code;

    const message = error.response.data?.message;

    if (originalRequest?.url?.includes("/auth/refresh")) {
      clearAuthAndRedirect("/signin", message || "Session expired");

      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post("/auth/refresh", {});

        const newAccessToken = refreshRes.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("NO ACCESS TOKEN");
        }

        localStorage.setItem("authToken", newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAuthAndRedirect("/signin", "Session expired. Login again.");

        return Promise.reject(refreshError);
      }
    }

    if (status === 403 && code === "ACCOUNT_DEACTIVATED") {
      clearAuthAndRedirect("/signin", message);

      return Promise.reject(error);
    }

    if (status === 404) {
      toast.error(message || "Not found");
    } else if (status >= 500) {
      toast.error(message || "Server error");
    } else {
      toast.error(message || "Something went wrong");
    }

    return Promise.reject(error);
  },
);

export default api;
