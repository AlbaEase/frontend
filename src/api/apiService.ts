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
    
    console.log("🔍 원본 요청 데이터:", JSON.stringify(data, null, 2));
    
    // 백엔드가 기대하는 데이터 형식으로 변환 - 백엔드는 Long 타입을 사용함
    const payloadData = {
      // fromUserId가 0인 경우를 명시적으로 처리 (0도 유효한 ID)
      fromUserId: data.fromUserId !== undefined ? Number(data.fromUserId) : null,
      scheduleId: data.scheduleId ? Number(data.scheduleId) : null,
      requestType: data.requestType,
      requestDate: data.requestDate
    };
    
    console.log("🔍 변환된 payload - fromUserId:", payloadData.fromUserId, 
                "타입:", typeof payloadData.fromUserId, 
                "원본 fromUserId:", data.fromUserId, 
                "원본 타입:", typeof data.fromUserId);
    
    // 특정 사용자에게 요청하는 경우에만 toUserId 추가
    if (data.requestType === 'SPECIFIC_USER' && data.toUserId !== undefined) {
      (payloadData as any).toUserId = Number(data.toUserId);
      console.log("🔍 변환된 payload - toUserId:", (payloadData as any).toUserId, 
                  "타입:", typeof (payloadData as any).toUserId, 
                  "원본 toUserId:", data.toUserId, 
                  "원본 타입:", typeof data.toUserId);
    }
    
    // fromUserId가 유효한지 확인 (0도 유효한 ID로 간주)
    // null, undefined 또는 NaN인 경우에만 사용자 정보에서 가져오기 시도
    if (payloadData.fromUserId === null || payloadData.fromUserId === undefined || isNaN(payloadData.fromUserId)) {
      console.log("🔍 fromUserId가 없거나 유효하지 않음, 사용자 정보에서 가져오기 시도");
      
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) {
        throw new Error("요청자 ID가 필요합니다. 사용자 정보를 찾을 수 없습니다.");
      }
      
      try {
        const userInfo = JSON.parse(userInfoStr);
        console.log("🔍 userInfo 전체 내용:", userInfo);
        
        // 가능한 모든 ID 필드 순회하며 검색
        let userId = null;
        
        // 정확한 필드명 먼저 확인 (userId가 0인 경우도 유효한 값으로 처리)
        if (userInfo.userId !== undefined) {
          userId = userInfo.userId;
          console.log("🔍 userInfo.userId 필드 발견:", userId);
        } 
        else if (userInfo.id !== undefined) {
          userId = userInfo.id;
          console.log("🔍 userInfo.id 필드 발견:", userId);
        }
        // 대소문자 구분 없이 모든 필드 검색
        else {
          console.log("🔍 정확한 ID 필드를 찾을 수 없어 전체 검색 진행");
          for (const key in userInfo) {
            if (typeof key === 'string' && 
                (key.toLowerCase() === 'userid' || 
                 key.toLowerCase() === 'id' || 
                 key.toLowerCase().includes('userid') || 
                 key.toLowerCase().includes('user_id'))) {
              if (userInfo[key] !== undefined) {
                userId = userInfo[key];
                console.log(`🔍 ${key} 필드에서 ID 발견:`, userId);
                break;
              }
            }
          }
        }
        
        if (userId !== null && userId !== undefined) {
          payloadData.fromUserId = Number(userId);
          console.log("🔍 최종 발견된 fromUserId:", payloadData.fromUserId);
          
          // ID가 NaN인 경우만 에러 처리 (0은 유효한 값)
          if (isNaN(payloadData.fromUserId)) {
            throw new Error("유효하지 않은 요청자 ID입니다: " + userId);
          }
        } else {
          throw new Error("요청자 ID가 필요합니다. 사용자 정보에서 ID를 찾을 수 없습니다.");
        }
      } catch (e) {
        console.error("🚨 사용자 정보 처리 중 오류:", e);
        throw new Error("요청자 ID가 필요합니다. 사용자 정보를 처리할 수 없습니다.");
      }
    }
    
    // 최종 데이터 유효성 검사 (0도 유효한 ID로 인식)
    if (payloadData.fromUserId === null || payloadData.fromUserId === undefined || isNaN(payloadData.fromUserId)) {
      throw new Error("요청자 ID가 필요합니다.");
    }
    
    // scheduleId 검증
    if (payloadData.scheduleId === null || payloadData.scheduleId === undefined || isNaN(payloadData.scheduleId) || payloadData.scheduleId <= 0) {
      throw new Error("유효한 스케줄 ID가 필요합니다.");
    }
    
    // SPECIFIC_USER 타입일 때 toUserId 검증
    if (payloadData.requestType === 'SPECIFIC_USER') {
      if ((payloadData as any).toUserId === undefined || (payloadData as any).toUserId === null || isNaN((payloadData as any).toUserId)) {
        throw new Error("특정 사용자에게 요청할 때는 대상 사용자 ID가 필요합니다.");
      }
      
      if (payloadData.fromUserId === (payloadData as any).toUserId) {
        throw new Error("자기 자신에게 대타 요청을 할 수 없습니다.");
      }
    }
    
    // 모든 필드의 값을 로깅
    console.log('🔍 최종 대타 요청 데이터:');
    console.log('  - fromUserId:', payloadData.fromUserId, '(타입:', typeof payloadData.fromUserId, ')');
    console.log('  - scheduleId:', payloadData.scheduleId, '(타입:', typeof payloadData.scheduleId, ')');
    console.log('  - requestType:', payloadData.requestType, '(타입:', typeof payloadData.requestType, ')');
    console.log('  - requestDate:', payloadData.requestDate, '(타입:', typeof payloadData.requestDate, ')');
    
    if ((payloadData as any).toUserId) {
      console.log('  - toUserId:', (payloadData as any).toUserId, '(타입:', typeof (payloadData as any).toUserId, ')');
    }
    
    console.log(`🔍 요청 URL: /shift-requests/store/${storeId}`);
    
    try {
      // API 요청 구성 - 헤더에 Content-Type 명시적으로 설정
      const response = await axiosInstance.post<ShiftResponse>(
        `/shift-requests/store/${storeId}`, 
        payloadData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      console.log('✅ 대타 요청 성공:', response.data);
      return response.data;
    } catch (error: any) {
      // 에러 상세 분석
      console.error('🚨 대타 요청 중 오류 발생:', error);
      
      if (error.response) {
        console.error('🚨 응답 상태:', error.response.status);
        console.error('🚨 응답 데이터:', error.response.data);
        console.error('🚨 응답 헤더:', error.response.headers);
        
        if (error.response.status === 400) {
          console.error('🚨 서버에 전송된 데이터:', payloadData);
          throw new Error("요청 형식이 올바르지 않습니다. 입력 데이터를 확인해 주세요.");
        } else if (error.response.status === 401) {
          throw new Error("인증에 실패했습니다. 다시 로그인해 주세요.");
        } else if (error.response.status === 403) {
          throw new Error("권한이 없습니다. 접근 권한을 확인해 주세요.");
        } else if (error.response.status === 404) {
          throw new Error("요청한 자원을 찾을 수 없습니다.");
        } else if (error.response.status === 500) {
          throw new Error("서버 내부 오류입니다. 잠시 후 다시 시도해 주세요.");
        }
      } else if (error.request) {
        console.error('🚨 요청은 보냈으나 응답이 없음:', error.request);
        throw new Error("서버로부터 응답이 없습니다. 네트워크 연결을 확인해 주세요.");
      } else {
        console.error('🚨 오류 메시지:', error.message);
        throw error;
      }
      throw error;
    }
  } catch (error: any) {
    console.error('🚨 대타 요청 처리 중 오류:', error);
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
