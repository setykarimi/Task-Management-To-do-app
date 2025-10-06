// axios-instance.ts
import axios from "axios";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const REFRESH_URL = `${SUPABASE_URL}/auth/v1/token`;

const http = axios.create({
  baseURL: SUPABASE_URL,
  timeout: 10000,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  },
});

// Single inflight refresh promise
let refreshPromise: Promise<string | null> | null = null;

// Helper: perform refresh and return new access token or null
async function performRefresh(refreshToken: string): Promise<string | null> {
  try {
    const { data } = await axios.post(
      REFRESH_URL,
      { grant_type: "refresh_token", refresh_token: refreshToken },
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Supabase returns access_token and refresh_token
    if (data?.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    if (data?.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    // Update default auth header
    http.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
    return data.access_token ?? null;
  } catch (err) {
    // refresh failed
    return null;
  }
}

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401, just propagate
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent retry loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject(error);
    }

    // If a refresh is already in progress, wait for it
    if (!refreshPromise) {
      refreshPromise = performRefresh(refreshToken);
      // ensure we clear the reference after completion
      refreshPromise.finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;
    if (newAccessToken) {
      // set header and retry original request
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return http(originalRequest);
    }

    // Refresh failed -> clear and redirect
    localStorage.clear();
    window.location.href = "/";
    return Promise.reject(error);
  }
);

export default http;