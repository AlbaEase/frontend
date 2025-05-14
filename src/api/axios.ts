// src/api/axios.ts
import axios from "axios";
import { API_URL } from "../utils/config";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// api 요청 실패 시 공통 에러 처리 등을 추가
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리 로직
    return Promise.reject(error);
  }
);

export default axiosInstance;
