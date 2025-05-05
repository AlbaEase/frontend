import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://3.39.237.218:8080", // 백엔드 서버 주소
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: false,
});

// ✅ 요청 인터셉터에서 최신 토큰 가져오기
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("🔍 인터셉터 실행 - 저장된 토큰:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ Authorization 헤더 추가됨:", config.headers);
    } else {
      console.warn(
        "🚨 Authorization 헤더 없음! 토큰이 저장되지 않았거나 불러올 수 없음."
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🚨 토큰이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ localStorage 변경 감지하여 axiosInstance 업데이트
window.addEventListener("storage", () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    console.log("✅ 스토리지 변경 감지: Authorization 헤더 업데이트됨!");
  }
});

export default axiosInstance;
