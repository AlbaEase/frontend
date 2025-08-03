// src/api/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // .env에서 설정된 API 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 필요 시
});

// ✅ 요청 인터셉터 - Authorization 토큰 자동 삽입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("🔐 저장된 토큰:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ Authorization 헤더 추가됨:", config.headers);
    } else {
      console.warn("⚠️ accessToken이 없습니다. 로그인되지 않은 상태입니다.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 - 공통 에러 처리 (선택)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 여기에 401, 403 등 처리 가능
    return Promise.reject(error);
  }
);

// ✅ 다른 탭에서 로그인/로그아웃 시 헤더 자동 반영
window.addEventListener("storage", () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    console.log("✅ 스토리지 변경 감지: Authorization 헤더 업데이트됨!");
  } else {
    delete axiosInstance.defaults.headers["Authorization"];
    console.log("🧼 accessToken 삭제됨: Authorization 헤더 제거됨.");
  }
});

export default axiosInstance;
