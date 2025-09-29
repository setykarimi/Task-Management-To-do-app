import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "apikey": import.meta.env.VITE_API_KEY,
    "Content-Type": "application/json"
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default http;
