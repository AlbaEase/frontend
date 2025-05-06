// src/api/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 인증 사용하는 경우
});

// 요청 보내기 전에 토큰 자동 첨부 (단, verify-password 엔드포인트는 제외)
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.includes("/user/verify-password")) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리 로직 (추가적인 로깅 등을 할 수 있음)
    return Promise.reject(error);
  }
);

export default axiosInstance;
