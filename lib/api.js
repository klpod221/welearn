import axios from 'axios';
import { getSession } from "next-auth/react";

const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
instance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Xử lý lỗi trả về từ server
      console.error("API Error:", error.response.data);

      // Tạo error message từ response hoặc sử dụng message mặc định
      const errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        error.response.statusText ||
        "An error occurred";

      // Throw error với message đã xử lý
      throw new Error(errorMessage);
    }

    // Xử lý lỗi không có response (network error, timeout, etc.)
    if (error.request) {
      console.error("Network Error:", error.request);
      throw new Error(
        "Network error: Unable to reach the server. Please check your connection."
      );
    }

    // Các lỗi khác
    console.error("Error:", error.message);
    throw error;
  }
);

// API Methods
const api = {
  get: (url, params = {}, config = {}) => instance.get(url, { params, ...config }),
  post: (url, data = {}, config = {}) => instance.post(url, data, { ...config }),
  put: (url, data = {}, config = {}) => instance.put(url, data, { ...config }),
  patch: (url, data = {}, config = {}) => instance.patch(url, data, { ...config }),
  delete: (url, config = {}) => instance.delete(url, { ...config }),
};

export default api;
