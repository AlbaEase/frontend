// 1. 코드분리 api호출만 담당
// 2. 재사용성 증가
import axiosInstance from "./loginAxios"; // ✅ axiosInstance 사용

// ======= 알림(Notification) 관련 API =======

// 알림 목록 조회
export const fetchNotifications = async () => {
  try {
    // 사용자 정보를 로컬 스토리지에서 가져오기
    const userInfoStr = localStorage.getItem("userInfo");
    
    if (!userInfoStr) {
      console.error("🚨 사용자 정보를 찾을 수 없습니다.");
      return [];
    }
    
    const userInfo = JSON.parse(userInfoStr) as { userId?: number };
    
    // 사용자 ID를 쿼리 파라미터로 전달
    if (userInfo && userInfo.userId) {
      const response = await axiosInstance.get(`/notification/me?userId=${userInfo.userId}`);
      console.log("✅ 알림 데이터 가져옴:", response.data);
      return response.data.notifications || [];
    } else {
      console.error("🚨 유효한 사용자 ID가 없습니다:", userInfo);
      return [];
    }
  } catch (error) {
    console.error("🚨 알림 데이터를 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 알림 삭제
export const deleteNotification = async (notificationId: number) => {
  try {
    await axiosInstance.delete(`/notification/me/${notificationId}`);
    console.log(`✅ 알림 ID ${notificationId} 삭제 완료`);
    return true;
  } catch (error) {
    console.error(`🚨 알림 ID ${notificationId} 삭제 중 오류 발생:`, error);
    return false;
  }
};

// 모든 알림 삭제
export const deleteAllNotifications = async () => {
  try {
    // 사용자 정보를 로컬 스토리지에서 가져오기
    const userInfoStr = localStorage.getItem("userInfo");
    let userId: number | null = null;
    
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr) as { userId?: number };
      userId = userInfo.userId || null;
    }
    
    // userId가 있으면 쿼리 파라미터로 전달
    const url = userId ? `/notification/me?userId=${userId}` : '/notification/me';
    await axiosInstance.delete(url);
    
    console.log('✅ 모든 알림 삭제 완료');
    return true;
  } catch (error) {
    console.error('🚨 모든 알림 삭제 중 오류 발생:', error);
    return false;
  }
};

// ======= 근무 수정(Modification) 관련 API =======

// 근무 시간 수정 요청
export const requestModification = async (storeId: number, data: {
  scheduleId: number;
  details: string;
}) => {
  try {
    const response = await axiosInstance.post(`/shift-modification/store/${storeId}`, data);
    console.log('✅ 근무 수정 요청 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('🚨 근무 수정 요청 중 오류 발생:', error);
    throw error;
  }
};

// 수정 요청 승인/거절
export const updateModificationStatus = async (modificationId: number, status: 'APPROVED' | 'REJECTED') => {
  try {
    const response = await axiosInstance.patch(
      `/shift-modification/${modificationId}/status?status=${status}`
    );
    console.log(`✅ 수정 요청 ID ${modificationId} 상태 업데이트 완료:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`🚨 수정 요청 ID ${modificationId} 상태 업데이트 중 오류 발생:`, error);
    throw error;
  }
};

// ======= 근무 교대(Shift) 관련 API =======

// 대타 요청
export const requestShift = async (storeId: number, data: {
  toUserId: number;
  scheduleId: number;
  requestType: 'SPECIFIC_USER' | 'ALL_USERS';
  requestDate: string;
}) => {
  try {
    console.log(`🔍 대타 요청 데이터:`, data);
    console.log(`🔍 요청 URL: /shift-requests/store/${storeId}`);
    
    const token = localStorage.getItem("accessToken");
    console.log(`🔍 사용 중인 토큰:`, token);
    
    const response = await axiosInstance.post(`/shift-requests/store/${storeId}`, data);
    console.log('✅ 대타 요청 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('🚨 대타 요청 중 오류 발생:', error);
    if (error.response) {
      console.error('🚨 응답 데이터:', error.response.data);
      console.error('🚨 응답 상태:', error.response.status);
      console.error('🚨 응답 헤더:', error.response.headers);
    } else if (error.request) {
      console.error('🚨 요청은 보냈으나 응답이 없음:', error.request);
    } else {
      console.error('🚨 오류 메시지:', error.message);
    }
    throw error;
  }
};

// 대타 요청 승인/거절
export const updateShiftStatus = async (shiftId: number, status: 'APPROVED' | 'REJECTED') => {
  try {
    const response = await axiosInstance.patch(
      `/shift-requests/${shiftId}/status?status=${status}`
    );
    console.log(`✅ 대타 요청 ID ${shiftId} 상태 업데이트 완료:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`🚨 대타 요청 ID ${shiftId} 상태 업데이트 중 오류 발생:`, error);
    throw error;
  }
};
