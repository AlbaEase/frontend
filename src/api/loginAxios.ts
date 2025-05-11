import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://3.39.237.218:8080";

// 토큰 관련 상수 정의
const TOKEN_KEY = "accessToken";
const USER_INFO_KEY = "userInfo";

const axiosInstance = axios.create({
  baseURL: apiUrl, // 환경변수 또는 기본값 사용
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // CORS 인증 정보 전송 비활성화 - 서버 설정과 맞춰줌
});

// 토큰 유효성 검사 함수
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    // JWT 토큰 형식 검증 (간단한 형식 체크)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn("🚨 유효하지 않은 토큰 형식입니다.");
      return false;
    }
    
    // 만료 시간 검증 (JWT 페이로드 디코딩)
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn("🚨 토큰이 만료되었습니다.");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("🚨 토큰 검증 중 오류:", error);
    return false;
  }
};

// 토큰 가져오기 함수 (중복 코드 제거)
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  
  if (!token) {
    console.warn("🚨 토큰이 저장되어 있지 않습니다.");
    return null;
  }
  
  // 토큰 유효성 검사
  if (!isTokenValid(token)) {
    console.warn("🚨 저장된 토큰이 유효하지 않습니다. 토큰을 삭제합니다.");
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  
  return token;
};

// ✅ 요청 인터셉터에서 최신 토큰 가져오기
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("🔍 인터셉터 실행 - 저장된 토큰:", token ? token.substring(0, 10) + "..." : "없음");

    if (token) {
      // 백엔드에서 Bearer 인증 방식을 사용하므로 헤더에 Bearer 접두사를 붙여 설정
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ Authorization 헤더 추가됨:", `Bearer ${token.substring(0, 10)}...`);
      
      // 디버깅: 모든 헤더 출력
      console.log("🔍 요청 헤더:", JSON.stringify(config.headers));
    } else {
      console.warn(
        "🚨 Authorization 헤더 없음! 토큰이 저장되지 않았거나 불러올 수 없음."
      );
      
      // 로그인 페이지가 아닌 경우에만 리다이렉트 처리
      const isLoginPage = window.location.pathname.includes('/login');
      if (!isLoginPage) {
        console.log("🔄 인증이 필요합니다. 로그인 페이지로 이동합니다.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🚨 API 오류 발생:", error.message);
    
    if (error.response) {
      console.error("🚨 응답 상태:", error.response.status);
      console.error("🚨 응답 데이터:", error.response.data);
      
      // 401 Unauthorized 에러 처리
      if (error.response.status === 401) {
        console.log("🚨 토큰이 만료되었습니다. 다시 로그인 해주세요.");
        // 로컬 스토리지의 인증 정보 삭제
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        
        // 로그인 페이지가 아닌 경우에만 리다이렉트 처리
        const isLoginPage = window.location.pathname.includes('/login');
        if (!isLoginPage) {
          // 로그인 페이지로 리다이렉트 (0.5초 지연)
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// ✅ 토큰 설정 및 초기화 함수
export const setAuthToken = (token: string | null) => {
  if (token) {
    // 토큰 저장 전에 Bearer 접두사 제거 (중복 방지)
    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    
    localStorage.setItem(TOKEN_KEY, cleanToken);
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${cleanToken}`;
    console.log("✅ 토큰 설정됨:", `Bearer ${cleanToken.substring(0, 10)}...`);
    
    // 토큰 유효성 검증
    if (!isTokenValid(cleanToken)) {
      console.warn("⚠️ 설정된 토큰이 유효하지 않을 수 있습니다.");
    }
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axiosInstance.defaults.headers["Authorization"];
    console.log("✅ 토큰 제거됨");
  }
};

// ✅ localStorage 변경 감지하여 axiosInstance 업데이트
window.addEventListener("storage", () => {
  const token = getToken();
  if (token) {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    console.log("✅ 스토리지 변경 감지: Authorization 헤더 업데이트됨!");
  } else {
    delete axiosInstance.defaults.headers["Authorization"];
    console.log("✅ 스토리지 변경 감지: Authorization 헤더 제거됨!");
  }
});

export default axiosInstance;
