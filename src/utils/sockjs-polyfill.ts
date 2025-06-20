// SockJS 폴리필
// global 객체가 없는 경우 window 객체를 사용하도록 설정
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

export default {}; 