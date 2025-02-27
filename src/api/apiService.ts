// 1. 코드분리 api호출만 담당
// 2. 재사용성 증가
import axiosInstance from "./loginAxios"; // ✅ axiosInstance 사용

// ✅ 알람 데이터를 가져오는 함수
export const fetchNotifications = async () => {
  try {
    const response = await axiosInstance.get("/notification/me"); // ✅ 자동으로 토큰 추가됨
    console.log("✅ 알람 데이터 가져옴:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 알람 데이터를 가져오는 중 오류 발생:", error);
    return null;
  }
};
