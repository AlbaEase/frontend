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
      // 토큰을 헤더에 추가할 때 Bearer 접두사와 공백 확인
      // JWT Filter에서 "Bearer " 접두사가 있는지 확인할 수 있음
      config.headers["Authorization"] = `Bearer ${token}`;
      
      // 디버깅용 로그
      console.log("✅ Authorization 헤더:", config.headers["Authorization"]);
      console.log("✅ 전체 헤더:", JSON.stringify(config.headers));
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
  (response) => {
    // 응답이 성공적으로 왔을 때 로그 기록
    console.log(`✅ ${response.config.url} 응답 성공:`, response.status);
    return response;
  },
  (error) => {
    // 에러 응답의 상세 정보 출력
    console.error("🚨 API 오류 발생:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.config?.headers,
    });

    if (error.response?.status === 401) {
      console.log("🚨 토큰이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
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
  } else {
    // 토큰이 없는 경우 헤더 제거
    delete axiosInstance.defaults.headers["Authorization"];
    console.log("✅ 스토리지 변경 감지: 토큰 없음, Authorization 헤더 제거됨");
  }
});

export default axiosInstance;
