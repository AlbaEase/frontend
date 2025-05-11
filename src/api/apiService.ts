// 1. 코드분리 api호출만 담당
// 2. 재사용성 증가
import axiosInstance, { getToken, setAuthToken } from "./loginAxios"; // ✅ getToken과 setAuthToken 추가
import {
  Notification,
  NotificationResponse,
  ModificationRequest,
  ModificationResponse,
  ShiftRequest,
  ShiftResponse
} from "../types/api";

// 로그인 상태 확인 및 토큰 설정
export const checkAuthAndSetToken = (): boolean => {
  const token = getToken(); // localStorage.getItem 대신 getToken 사용
  const userInfo = localStorage.getItem("userInfo");
  
  console.log("🔍 저장된 토큰 확인:", token ? "토큰 있음" : "토큰 없음");
  console.log("🔍 저장된 사용자 정보:", userInfo ? "정보 있음" : "정보 없음");
  
  if (token) {
    // 토큰이 있으면 헤더에 설정
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    return true;
  }
  
  console.warn("🚨 인증 토큰이 없습니다. 로그인이 필요합니다.");
  return false;
};

// ======= 알림(Notification) 관련 API =======

// 알림 목록 조회
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    // 인증 상태 확인
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 알림을 가져올 수 없습니다.");
      return [];
    }
    
    // 사용자 정보를 로컬 스토리지에서 가져오기
    const userInfoStr = localStorage.getItem("userInfo");
    
    if (!userInfoStr) {
      console.error("🚨 사용자 정보를 찾을 수 없습니다.");
      return [];
    }
    
    const userInfo = JSON.parse(userInfoStr) as { userId?: number };
    
    // 사용자 ID를 쿼리 파라미터로 전달 (userId가 0이어도 유효한 것으로 처리)
    if (userInfo && (userInfo.userId !== undefined && userInfo.userId !== null)) {
      const response = await axiosInstance.get<NotificationResponse>(`/notification/me?userId=${userInfo.userId}`);
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
export const deleteNotification = async (notificationId: number): Promise<boolean> => {
  try {
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 알림을 삭제할 수 없습니다.");
      return false;
    }
    await axiosInstance.delete(`/notification/me/${notificationId}`);
    console.log(`✅ 알림 ID ${notificationId} 삭제 완료`);
    return true;
  } catch (error) {
    console.error(`🚨 알림 ID ${notificationId} 삭제 중 오류 발생:`, error);
    return false;
  }
};

// 모든 알림 삭제
export const deleteAllNotifications = async (): Promise<boolean> => {
  try {
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 알림을 삭제할 수 없습니다.");
      return false;
    }
    // 사용자 정보를 로컬 스토리지에서 가져오기
    const userInfoStr = localStorage.getItem("userInfo");
    let userId: number | null = null;
    
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr) as { userId?: number };
      // userId가 0이어도 유효한 것으로 처리
      userId = userInfo.userId !== undefined ? userInfo.userId : null;
    }
    
    // userId가 있으면 쿼리 파라미터로 전달
    const url = userId !== null ? `/notification/me?userId=${userId}` : '/notification/me';
    await axiosInstance.delete(url);
    
    console.log('✅ 모든 알림 삭제 완료');
    return true;
  } catch (error) {
    console.error('🚨 모든 알림 삭제 중 오류 발생:', error);
    return false;
  }
};

// ======= 근무 수정(Modification) 관련 API =======

// 근무 시간 수정 요청 목록 조회
export const fetchModificationRequests = async (): Promise<ModificationResponse[]> => {
  try {
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 근무 변경 요청 목록을 가져올 수 없습니다.");
      return [];
    }
    // 사용자 정보를 로컬 스토리지에서 가져오기
    const userInfoStr = localStorage.getItem("userInfo");
    let userId: number | null = null;
    
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr) as { userId?: number };
      // userId가 0이어도 유효한 것으로 처리
      userId = userInfo.userId !== undefined ? userInfo.userId : null;
    }
    
    if (userId === null) {
      console.error("🚨 유효한 사용자 ID가 없습니다");
      return [];
    }
    
    // 사용자별 수정 요청 목록 조회 엔드포인트 호출
    const response = await axiosInstance.get<ModificationResponse[]>(`/shift-modification/user/${userId}`);
    console.log("✅ 근무 변경 요청 목록 가져옴:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 근무 변경 요청 목록을 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 근무 시간 수정 요청
export const requestModification = async (
  storeId: number, 
  data: ModificationRequest
): Promise<ModificationResponse> => {
  try {
    if (!checkAuthAndSetToken()) {
      throw new Error("인증 실패: 근무 수정 요청을 할 수 없습니다.");
    }
    const response = await axiosInstance.post<ModificationResponse>(`/shift-modification/store/${storeId}`, data);
    console.log('✅ 근무 수정 요청 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('🚨 근무 수정 요청 중 오류 발생:', error);
    throw error;
  }
};

// 수정 요청 승인/거절
export const updateModificationStatus = async (
  modificationId: number, 
  status: 'APPROVED' | 'REJECTED'
): Promise<ModificationResponse> => {
  try {
    if (!checkAuthAndSetToken()) {
      throw new Error("인증 실패: 수정 요청 상태를 변경할 수 없습니다.");
    }
    const response = await axiosInstance.patch<ModificationResponse>(
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

// 대타 요청 목록 조회
export const fetchShiftRequests = async (storeId?: number): Promise<ShiftResponse[]> => {
  try {
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 대타 요청 목록을 가져올 수 없습니다.");
      return [];
    }
    let url = '/shift-requests';
    
    // 스토어 ID가 제공된 경우 해당 스토어의 대타 요청만 조회
    if (storeId) {
      url = `/shift-requests/store/${storeId}`;
    }
    
    const response = await axiosInstance.get<ShiftResponse[]>(url);
    console.log("✅ 대타 요청 목록 가져옴:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 대타 요청 목록을 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 대타 요청
export const requestShift = async (
  storeId: number, 
  data: ShiftRequest
): Promise<ShiftResponse> => {
  try {
    if (!checkAuthAndSetToken()) {
      throw new Error("인증 실패: 대타 요청을 할 수 없습니다.");
    }
    
    // 사용자 정보 확인
    const userInfoStr = localStorage.getItem("userInfo");
    if (!userInfoStr) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }
    
    const userInfo = JSON.parse(userInfoStr);
    // fromUserId가 없으면 현재 로그인한 사용자 ID 사용
    if (!data.fromUserId && userInfo.userId !== undefined) {
      data.fromUserId = userInfo.userId;
    }
    
    // 요청 데이터 검증
    if (!data.scheduleId) {
      throw new Error("유효한 스케줄 ID가 필요합니다.");
    }
    
    if (data.requestType === 'SPECIFIC_USER' && !data.toUserId) {
      throw new Error("특정 사용자에게 요청할 때는 대상 사용자 ID가 필요합니다.");
    }
    
    console.log(`🔍 대타 요청 데이터:`, data);
    console.log(`🔍 요청 URL: /shift-requests/store/${storeId}`);
    
    // getToken 사용
    const token = getToken();
    console.log(`🔍 사용 중인 토큰:`, token ? `${token.substring(0, 10)}...` : "없음");
    
    const response = await axiosInstance.post<ShiftResponse>(`/shift-requests/store/${storeId}`, data);
    console.log('✅ 대타 요청 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('🚨 대타 요청 중 오류 발생:', error);
    if (error.response) {
      console.error('🚨 응답 데이터:', error.response.data);
      console.error('🚨 응답 상태:', error.response.status);
      console.error('🚨 응답 헤더:', error.response.headers);
      
      // 서버 응답 메시지가 있으면 해당 메시지로 오류 표시
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    } else if (error.request) {
      console.error('🚨 요청은 보냈으나 응답이 없음:', error.request);
    } else {
      console.error('🚨 오류 메시지:', error.message);
    }
    throw error;
  }
};

// 대타 요청 승인/거절
export const updateShiftStatus = async (
  shiftId: number, 
  status: 'APPROVED' | 'REJECTED'
): Promise<ShiftResponse> => {
  try {
    if (!checkAuthAndSetToken()) {
      throw new Error("인증 실패: 대타 요청 상태를 변경할 수 없습니다.");
    }
    const response = await axiosInstance.patch<ShiftResponse>(
      `/shift-requests/${shiftId}/status?status=${status}`
    );
    console.log(`✅ 대타 요청 ID ${shiftId} 상태 업데이트 완료:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`🚨 대타 요청 ID ${shiftId} 상태 업데이트 중 오류 발생:`, error);
    throw error;
  }
};
