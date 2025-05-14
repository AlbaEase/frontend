/**
 * 환경에 따른 API 설정 관리
 * 개발과 배포 환경 모두 배포된 백엔드 서버를 사용합니다.
 */

// 환경 변수에서 API URL 가져오기 (기본값은 배포된 서버 주소)
const BACKEND_API_URL = 'http://3.39.237.218:8080';

// 로깅을 위한 환경 정보
console.log(`🔌 API URL: ${BACKEND_API_URL}`);

// 모든 환경에서 동일한 백엔드 API URL 사용
export const API_URL = BACKEND_API_URL;

// 기타 환경별 설정을 추가할 수 있음
export const config = {
  apiUrl: API_URL,
  // 여기에 추가 설정을 넣을 수 있음
};

export default config; 