import axios from "axios";
import { AUTH_API } from "@/services/api";

const http = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  timeout: 10000,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token || !refreshToken) {
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject("User not authenticated");
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          AUTH_API.REFRESH_TOKEN,
          { refresh_token: refreshToken },
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          if (data.refresh_token)
            localStorage.setItem("refresh_token", data.refresh_token);

          http.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

          return http(originalRequest);
        }
      } catch (err) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
