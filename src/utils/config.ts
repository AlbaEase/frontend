/**
 * 환경에 따른 API 설정 관리
 * 개발과 배포 환경 모두에서 구성 가능한 백엔드 서버를 사용합니다.
 */

// 환경 변수에서 API URL 가져오기 (없으면 배포된 서버 주소를 기본값으로 사용)
const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://3.39.237.218:8080';

// 로깅을 위한 환경 정보
console.log(`🔌 API URL: ${BACKEND_API_URL}`);
console.log(`🔌 환경: ${import.meta.env.MODE}`);

// API URL 내보내기
export const API_URL = BACKEND_API_URL;

// 기타 환경별 설정
export const config = {
  apiUrl: API_URL,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
};

export default config; 