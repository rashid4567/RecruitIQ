import axios, { type AxiosRequestConfig } from "axios";

/* ================= TYPES ================= */
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
    _retry?: boolean;
}

/* ================= AXIOS INSTANCE ================= */
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
    (error) => {
        console.error("❌ Request interceptor error:", error);
        return Promise.reject(error);
    }
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
    (response) => {

        return response;
    },
    async (error) => {
        console.error("❌ Axios error:", {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
        });

        const originalRequest = error.config as AxiosRequestConfigWithRetry;

        // 🚫 Prevent infinite loop on refresh endpoint
        if (originalRequest?.url?.includes("/auth/refresh")) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            
            // Redirect to login
            if (window.location.pathname !== "/signin") {
                window.location.href = "/signin";
            }
            
            return Promise.reject(error);
        }

        // 🔁 Try refresh token once on 401
        if (error.response?.status === 401 && !originalRequest._retry) {
           
            originalRequest._retry = true;

            try {
                
                const res = await axios.post(
                    "/api/auth/refresh",
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

               

                const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;

                if (!newAccessToken) {
                    throw new Error("No access token returned from refresh");
                }

              
                localStorage.setItem("authToken", newAccessToken);

                // Update the original request with new token
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            
                return api(originalRequest);
            } catch (refreshError: any) {
                console.error("❌ Refresh failed:", refreshError.message);
                
                
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userId");

               
                if (!window.location.pathname.includes("signin")) {
                    window.location.href = "/signin";
                }
                
                return Promise.reject(refreshError);
            }
        }

     
        if (error.response?.status === 403) {
            console.error("❌ Forbidden - insufficient permissions");
        } else if (error.response?.status === 404) {
            console.error("❌ Endpoint not found:", error.config?.url);
        } else if (error.response?.status >= 500) {
            console.error("❌ Server error");
        }

        return Promise.reject(error);
    }
);

export default api;