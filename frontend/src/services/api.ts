import axios from "axios";

// 1. تحديد الرابط الأساسي للباك-إند
const API_BASE_URL = "http://127.0.0.1:8000/api/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. عمل Interceptor عشان يحقن الـ Token تلقائياً + يضمن وجود الـ Slash في آخر الروابط أوتوماتيك
api.interceptors.request.use(
  (config) => {
    // الجزء الجديد لحل مشكلة الـ Slash الاختيارية للديجانجو 🛠️
    if (config.url) {
      // لو الـ URL فيه Query Params (زي ?project=1)
      if (config.url.includes("?")) {
        const [path, query] = config.url.split("?");
        if (path && !path.endsWith("/")) {
          config.url = `${path}/?${query}`;
        }
      } else if (!config.url.endsWith("/")) {
        // لو رابط عادي حاف، بنحط "/" في آخره
        config.url += "/";
      }
    }

    // حقن الـ Token بتاعك زي ما هو
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. لو التوكن انتهى والباك رجع 401، نخرج اليوزر أوتوماتيك
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// 4. User API functions
export const userAPI = {
  getCurrentUser: () => api.get("users/me/"),
  updateUser: (data: any) => api.patch("users/me/", data),
  changePassword: (data: any) => api.post("users/change-password/", data),
  requestPasswordReset: (data: any) => api.post("users/password-reset/request/", data),
  verifyPasswordReset: (data: any) => api.post("users/password-reset/verify/", data),
  confirmPasswordReset: (data: any) => api.post("users/password-reset/confirm/", data),
  register: (data: any) => api.post("users/register/", data),
  login: (data: any) => api.post("users/login/", data),
  refreshToken: (data: any) => api.post("users/token/refresh/", data),
};

export default api;
