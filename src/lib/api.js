import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("gdmspl_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Let the browser set multipart boundary for FormData uploads
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Content-Type", undefined);
    } else if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry && typeof window !== "undefined") {
      original._retry = true;
      const refreshToken = localStorage.getItem("gdmspl_refresh_token");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem("gdmspl_access_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("gdmspl_refresh_token", data.refresh_token);
          }
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          localStorage.removeItem("gdmspl_access_token");
          localStorage.removeItem("gdmspl_refresh_token");
          localStorage.removeItem("gdmspl_admin_user");
          if (!window.location.pathname.startsWith("/admin/login")) {
            window.location.href = "/admin/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
