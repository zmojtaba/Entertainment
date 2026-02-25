
import axios from 'axios';
import { API_CONFIG } from "app/app-configs/apiConfig";

const api = axios.create({
  baseURL: `${API_CONFIG.plateDetection}/api/`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// اضافه کردن توکن به همه درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_access_token');

    if (token) {
      // امن‌ترین و خواناترین روش (بدون optional chaining مشکل‌دار)
      config.headers = {
        ...config.headers,                    // حفظ هدرهای قبلی
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// interceptor پاسخ (اختیاری ولی خیلی توصیه می‌شه فعال باشه)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // بعداً اینجا می‌تونی refresh token پیاده کنی
      // فعلاً ساده‌ترین واکنش:
      // localStorage.removeItem('jwt_access_token');
      // window.location.href = '/login';

      // یا فقط خطا رو برگردون
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;