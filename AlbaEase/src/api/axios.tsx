// src/api/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://3.39.237.218:8080", // url을 미리 작성해서 -> 가져다가 쓸 때는 상대주소면 작성하면 된다.
  headers: {
    "Content-Type": "application/json", // 데이터를 json형식으로 받을 예정이다.
  },
  withCredentials: true, // 백엔드에서 JWT 토큰을 쿠키에 저장해서 인증을 관리하는 방식-> 이 옵션 필요함
});
export default axiosInstance;
