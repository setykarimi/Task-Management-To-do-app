// axios-instance.ts
import axios from "axios";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔹 Endpoint صحیح برای refresh
const REFRESH_URL = `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`;

// ✅ ایجاد instance اصلی axios
const http = axios.create({
  baseURL: SUPABASE_URL,
  timeout: 10000,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  },
});

// 🔹 promise برای جلوگیری از چندبار refresh همزمان
let refreshPromise: Promise<string | null> | null = null;

/**
 * ✅ تابع رفرش توکن
 * از Supabase درخواست توکن جدید می‌گیره
 */
async function performRefresh(refreshToken: string): Promise<string | null> {
  try {
    const { data } = await axios.post(
      REFRESH_URL,
      { refresh_token: refreshToken },
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🔁 Refresh response:", data);

    // Supabase response structure:
    // { access_token, refresh_token, expires_in, token_type, user }

    if (data?.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }

    // فقط اگر refresh_token جدید اومده
    if (data?.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    // آپدیت هدرهای پیش‌فرض axios
    http.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
    return data.access_token ?? null;
  } catch (err) {
    console.error("❌ Refresh token failed:", err);
    return null;
  }
}

/**
 * ✅ interceptor درخواست‌ها:
 * قبل از هر request توکن فعلی رو به header اضافه می‌کنه
 */
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

/**
 * ✅ interceptor پاسخ‌ها:
 * اگر ارور 401 گرفت، به صورت خودکار refresh token انجام می‌ده
 */
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("🧱 Axios error:", error);

    const originalRequest = error.config;

    // اگر ارور غیر از 401 بود، مستقیم پاس بده
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // از تکرار درخواست جلوگیری می‌کنیم
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      console.warn("⚠️ No refresh token found, logging out...");
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject(error);
    }

    // فقط یک refresh همزمان
    if (!refreshPromise) {
      refreshPromise = performRefresh(refreshToken);
      refreshPromise.finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;
    if (newAccessToken) {
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return http(originalRequest); // ✅ retry request
    }

    // اگر نشد، logout
    localStorage.clear();
    window.location.href = "/";
    return Promise.reject(error);
  }
);

export default http;
