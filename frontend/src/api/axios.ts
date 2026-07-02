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
  (error) => Promise.reject(error),
);

function clearAuthAndRedirect(
  path: string,
  title: string,
  description?: string,
) {
  toast.warning(title, {
    description,
    duration: 5000,
  });
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  window.location.replace(path);
}

api.interceptors.response.use(
  (response) => {
    const message = response?.data?.message;
    if (message && response.config.method !== "get") {
      toast.success("Done", { description: message });
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (!error.response) {
      toast.error("No internet connection", {
        description: "Check your network and try again",
      });
      return Promise.reject(error);
    }

    const status = error.response.status;
    const code = error.response.data?.code;
    const message = error.response.data?.message;

    if (originalRequest?.url?.includes("/auth/refresh")) {
      clearAuthAndRedirect(
        "/signin",
        "Session expired",
        message || "You've been signed out — please log in again",
      );
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post("/auth/refresh", {});
        const newAccessToken = refreshRes.data?.data?.accessToken;

        if (!newAccessToken) throw new Error("NO ACCESS TOKEN");

        localStorage.setItem("authToken", newAccessToken);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAuthAndRedirect(
          "/signin",
          "Session expired",
          "Please log in again to continue",
        );
        return Promise.reject(refreshError);
      }
    }

    if (status === 403 && code === "ACCOUNT_DEACTIVATED") {
      clearAuthAndRedirect(
        "/signin",
        "Account deactivated",
        message || "Contact support if you think this is a mistake",
      );
      return Promise.reject(error);
    }

    if (status === 404) {
      toast.warning("Not found", {
        description: message || "The resource you requested doesn't exist",
      });
    } else if (status >= 500) {
  if (window.location.pathname !== "/500") {
    sessionStorage.setItem(
      "last-page",
      window.location.pathname + window.location.search,
    );

    window.location.replace("/500");
  }

  return Promise.reject(error);
} else {
      toast.error("Something went wrong", {
        description: message || "An unexpected error occurred",
      });
    }

    return Promise.reject(error);
  },
);

export default api;
