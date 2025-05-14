import axios from "axios";
import { API_URL } from "../utils/config";

// 환경 변수에서 API URL 가져오기 (기본값 설정)
const API_BASE_URL = API_URL;

// 로컬 스토리지 키 상수화
const TOKEN_KEY = "accessToken";
const USER_INFO_KEY = "userInfo";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// 토큰 가져오기 함수
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 사용자 정보 가져오기 함수
export const getUserInfo = (): any | null => {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr);
  } catch (e) {
    console.error("사용자 정보 파싱 오류:", e);
    return null;
  }
};

// 토큰 설정 함수
export const setAuthToken = (token: string): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axiosInstance.defaults.headers["Authorization"];
  }
};

// 사용자 정보 설정 함수
export const setUserInfo = (userInfo: any): void => {
  if (userInfo) {
    // 이메일이 staff1@albaease.com인 경우 (김시현) userId가 없으면 3으로 설정
    if (userInfo.email === 'staff1@albaease.com' && (userInfo.userId === undefined || userInfo.userId === null)) {
      console.log("김시현 사용자 감지: userId를 3으로 설정합니다.");
      userInfo.userId = 3;
    }
    
    // userId가 0인 경우에도 유효한 값으로 처리
    const processedUserInfo = {
      ...userInfo,
      userId: userInfo.userId !== undefined ? Number(userInfo.userId) : null
    };
    
    console.log("저장될 사용자 정보:", processedUserInfo);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(processedUserInfo));
  } else {
    localStorage.removeItem(USER_INFO_KEY);
  }
};

// 로그아웃 함수
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  delete axiosInstance.defaults.headers["Authorization"];
};

// 요청 인터셉터 - 모든 요청에 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      console.log("🔍 인터셉터 실행 - 저장된 토큰:", token.substring(0, 10) + "...");
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ Authorization 헤더 추가됨:", `Bearer ${token.substring(0, 10)}...`);
    }
    
    console.log("🔍 요청 헤더:", JSON.stringify(config.headers));
    return config;
  },
  (error) => {
    console.error("🚨 요청 인터셉터 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 오류 처리 및 토큰 만료 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("🚨 API 오류 발생:", error.message);
    
    // 응답이 있는 경우 상세 정보 출력
    if (error.response) {
      console.error("🚨 응답 상태:", error.response.status);
      console.error("🚨 응답 데이터:", error.response.data);
      
      // 401 Unauthorized - 토큰 만료 또는 인증 실패
      if (error.response.status === 401) {
        console.error("🚨 인증 실패 (401) - 토큰 만료 또는 유효하지 않음");
        logout(); // 로그아웃 처리
        
        // 로그인 페이지로 리다이렉트 (필요한 경우)
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
