// 1. 코드분리 api호출만 담당
// 2. 재사용성 증가
import axiosInstance, { getToken } from "./loginAxios"; // getToken만 사용
import {
  Notification,
  NotificationResponse,
  ModificationRequest,
  ModificationResponse,
  ShiftRequest,
  ShiftResponse,
  Schedule,
  ScheduleResponse,
  User
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

// 현재 인증된 사용자 정보 가져오기
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    // 인증 상태 확인
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 사용자 정보를 가져올 수 없습니다.");
      return null;
    }
    
    // /user/me 엔드포인트를 통해 현재 로그인한 사용자 정보 조회
    console.log("🔍 GET /user/me API 호출 시작");
    const response = await axiosInstance.get<User>('/user/me');
    
    if (response.data) {
      console.log("✅ 사용자 정보 가져옴:", response.data);
      
      // 로컬 스토리지에 최신 사용자 정보 저장
      const userId = response.data.id || response.data.userId;
      if (userId !== undefined) {
        const userInfo = {
          userId: Number(userId),
          email: response.data.email,
          name: response.data.name || response.data.fullName,
          role: response.data.role
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log("✅ 로컬 스토리지 사용자 정보 업데이트");
      }
      
      return response.data;
    }
    
    console.warn("🚨 사용자 정보가 없습니다.");
    return null;
  } catch (error) {
    console.error("🚨 사용자 정보를 가져오는 중 오류 발생:", error);
    return null;
  }
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
    
    // /user/me 엔드포인트를 통해 현재 로그인한 사용자 정보 조회
    try {
      const response = await axiosInstance.get<NotificationResponse>(`/notification/me`);
      console.log("✅ 알림 데이터 가져옴:", response.data);
      return response.data.notifications || [];
    } catch (error) {
      console.error("🚨 알림 데이터를 가져오는 중 오류 발생:", error);
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
    
    // /notification/me 엔드포인트를 직접 호출
    await axiosInstance.delete('/notification/me');
    
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

// ShiftRequest 확장 타입 (toUserId가 포함된 버전)
interface ShiftRequestWithToUser extends ShiftRequest {
  toUserId?: number;
}

// 대타 요청 데이터 타입
interface ShiftPayload {
  fromUserId: number | null;
  scheduleId: number | null;
  requestType: 'ALL_USERS' | 'SPECIFIC_USER';
  requestDate: string;
  toUserId?: number;
}

// 대타 요청 중 오류 발생 처리를 위한 타입
interface AxiosErrorResponse {
  response?: { 
    status: number; 
    data: Record<string, unknown>; 
    headers: Record<string, string>; 
  }; 
  request?: unknown; 
  message?: string; 
}

// 대타 요청
export const requestShift = async (
  storeId: number, 
  data: ShiftRequestWithToUser
): Promise<ShiftResponse> => {
  try {
    if (!checkAuthAndSetToken()) {
      throw new Error("인증 실패: 대타 요청을 할 수 없습니다.");
    }
    
    console.log("🔍 원본 요청 데이터:", JSON.stringify(data, null, 2));
    
    // 백엔드가 기대하는 데이터 형식으로 변환 - 백엔드는 Long 타입을 사용함
    const payloadData: ShiftPayload = {
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
      payloadData.toUserId = Number(data.toUserId);
      console.log("🔍 변환된 payload - toUserId:", payloadData.toUserId, 
                "타입:", typeof payloadData.toUserId, 
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
      if (payloadData.toUserId === undefined || payloadData.toUserId === null || isNaN(payloadData.toUserId)) {
        throw new Error("특정 사용자에게 요청할 때는 대상 사용자 ID가 필요합니다.");
      }
      
      if (payloadData.fromUserId === payloadData.toUserId) {
        throw new Error("자기 자신에게 대타 요청을 할 수 없습니다.");
      }
    }
    
    // 모든 필드의 값을 로깅
    console.log('🔍 최종 대타 요청 데이터:');
    console.log('  - fromUserId:', payloadData.fromUserId, '(타입:', typeof payloadData.fromUserId, ')');
    console.log('  - scheduleId:', payloadData.scheduleId, '(타입:', typeof payloadData.scheduleId, ')');
    console.log('  - requestType:', payloadData.requestType, '(타입:', typeof payloadData.requestType, ')');
    console.log('  - requestDate:', payloadData.requestDate, '(타입:', typeof payloadData.requestDate, ')');
    
    if (payloadData.toUserId) {
      console.log('  - toUserId:', payloadData.toUserId, '(타입:', typeof payloadData.toUserId, ')');
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
    } catch (error) {
      // 에러 상세 분석
      console.error('🚨 대타 요청 중 오류 발생:', error);
      
      // 에러 객체의 타입을 좁혀서 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosErrorResponse;
        
        if (axiosError.response) {
          console.error('🚨 응답 상태:', axiosError.response.status);
          console.error('🚨 응답 데이터:', axiosError.response.data);
          console.error('🚨 응답 헤더:', axiosError.response.headers);
        
          if (axiosError.response.status === 400) {
          console.error('🚨 서버에 전송된 데이터:', payloadData);
          throw new Error("요청 형식이 올바르지 않습니다. 입력 데이터를 확인해 주세요.");
          } else if (axiosError.response.status === 401) {
          throw new Error("인증에 실패했습니다. 다시 로그인해 주세요.");
          } else if (axiosError.response.status === 403) {
          throw new Error("권한이 없습니다. 접근 권한을 확인해 주세요.");
          } else if (axiosError.response.status === 404) {
          throw new Error("요청한 자원을 찾을 수 없습니다.");
          } else if (axiosError.response.status === 500) {
          throw new Error("서버 내부 오류입니다. 잠시 후 다시 시도해 주세요.");
        }
        } else if (axiosError.request) {
          console.error('🚨 요청은 보냈으나 응답이 없음:', axiosError.request);
        throw new Error("서버로부터 응답이 없습니다. 네트워크 연결을 확인해 주세요.");
        } else if (axiosError.message) {
          console.error('🚨 오류 메시지:', axiosError.message);
          throw new Error(axiosError.message);
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('🚨 대타 요청 처리 중 오류:', error);
    if (error instanceof Error) {
    throw error;
    } else {
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
};

// 대타 요청 승인/거절 함수의 파라미터 타입 정의
interface ShiftStatusUpdateOptions {
  userId?: number; // 대타 요청을 수락하는 현재 사용자 ID (toUserId가 null일 때 사용)
}

// 대타 요청 승인/거절
export const updateShiftStatus = async (
  shiftId: number, 
  status: 'APPROVED' | 'REJECTED',
  options?: ShiftStatusUpdateOptions
): Promise<ShiftResponse> => {
  try {
    if (!checkAuthAndSetToken()) {
      throw new Error("인증 실패: 대타 요청 상태를 변경할 수 없습니다.");
    }
    
    console.log(`🔍 대타 요청 ID ${shiftId} 상태 업데이트 시도: ${status}`);
    
    // 요청 데이터 구성 
    const requestData: Record<string, unknown> = {};
    
    // 대타 승인 시 userId 추가 (현재 사용자가 대타를 수락하는 경우)
    if (status === 'APPROVED') {
      let userId: number | undefined = options?.userId;
      
      // options에 userId가 없으면 API를 통해 현재 사용자 정보 조회
      if (userId === undefined) {
        try {
          const currentUser = await fetchCurrentUser();
          if (currentUser) {
            userId = currentUser.id || currentUser.userId;
            if (userId !== undefined) {
              console.log(`🔍 API에서 가져온 대타 요청 수락자 ID: ${userId}`);
              requestData.userId = Number(userId);
            }
          }
        } catch (userError) {
          console.error("사용자 정보 조회 중 오류:", userError);
        }
      } else {
        console.log(`🔍 전달받은 대타 요청 수락자 ID: ${userId}`);
        requestData.userId = userId;
      }
      
      // API 조회 실패 시 로컬 스토리지에서 가져오기 (마지막 대안)
      if (requestData.userId === undefined) {
        try {
          const userInfoStr = localStorage.getItem("userInfo");
          if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            if (userInfo.userId !== undefined) {
              requestData.userId = Number(userInfo.userId);
              console.log(`🔍 로컬 스토리지에서 가져온 대타 요청 수락자 ID: ${requestData.userId}`);
            }
          }
        } catch (error) {
          console.error("사용자 정보 파싱 중 오류:", error);
        }
      }
      
      // 여전히 userId가 없으면 오류 발생
      if (requestData.userId === undefined) {
        throw new Error("대타 요청 수락자 ID를 가져올 수 없습니다. 다시 로그인해 주세요.");
      }
    }
    
    // 요청 URL 구성
    const url = `/shift-requests/${shiftId}/status?status=${status}`;
    
    // API 요청 (userId가 있으면 데이터 포함, 없으면 빈 객체)
    const response = await axiosInstance.patch<ShiftResponse>(
      url, 
      Object.keys(requestData).length > 0 ? requestData : undefined
    );
    
    console.log(`✅ 대타 요청 ID ${shiftId} 상태 업데이트 완료:`, response.data);
    
    // 승인된 경우 스케줄 데이터 갱신이 필요함을 알림
    if (status === 'APPROVED' && response.data.schedule) {
      console.log('✅ 대타 요청이 승인되었습니다. 스케줄 변경이 필요합니다.');
      // 변경된 스케줄 정보 로깅
      console.log('📅 변경된 스케줄 정보:', response.data.schedule);
      
      // 백엔드에서 자동으로 알림을 생성하므로 여기서는 추가 작업 필요 없음
      // 클라이언트 측 캐시를 강제로 갱신하도록 이벤트 발생
      try {
        const event = new CustomEvent("scheduleUpdated", {
          detail: {
            scheduleId: response.data.schedule.scheduleId,
            userId: response.data.schedule.userId,
            workDate: response.data.schedule.workDate,
            storeId: response.data.schedule.storeId,
            startTime: response.data.schedule.startTime,
            endTime: response.data.schedule.endTime,
            userName: response.data.schedule.userName || "알 수 없음"
          }
        });
        window.dispatchEvent(event);
        console.log("스케줄 업데이트 이벤트 발생됨", event.detail);
        
        // 캘린더 UI 자동 갱신이 확실하지 않은 경우를 위한 백업
        try {
          // 현재 선택된 월에 해당하는 스케줄 데이터 갱신 이벤트 추가 발생
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth(); // 0-based
          
          // 매장 ID가 있는 경우
          if (response.data.schedule.storeId) {
            console.log(`매장 ID: ${response.data.schedule.storeId}의 스케줄 데이터 갱신 이벤트 발생 시도`);
            
            // 스케줄 새로고침 이벤트 발생 (별도 이벤트)
            const refreshEvent = new CustomEvent("refreshSchedules", {
              detail: {
                storeId: response.data.schedule.storeId,
                year: currentYear,
                month: currentMonth
              }
            });
            window.dispatchEvent(refreshEvent);
            console.log("스케줄 새로고침 이벤트 발생됨");
          }
        } catch (refreshError) {
          console.error("스케줄 새로고침 이벤트 발생 중 오류:", refreshError);
        }
      } catch (eventError) {
        console.error("스케줄 업데이트 이벤트 발생 중 오류:", eventError);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error(`🚨 대타 요청 ID ${shiftId} 상태 업데이트 중 오류 발생:`, error);
    throw error;
  }
};

// ======= 스케줄(Schedule) 관련 API =======

// 스케줄 목록 조회
export const fetchSchedules = async (storeId: number, year: number, month: number): Promise<Schedule[]> => {
  try {
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 스케줄을 가져올 수 없습니다.");
      return [];
    }
    
    // 월 데이터는 0부터 시작하므로 백엔드에 맞게 1을 더함
    const apiMonth = month + 1;
    
    const response = await axiosInstance.get<ScheduleResponse>(`/schedules/store/${storeId}/month?year=${year}&month=${apiMonth}`);
    console.log("✅ 스케줄 데이터 가져옴:", response.data);
    return response.data.schedules || [];
  } catch (error) {
    console.error("🚨 스케줄 데이터를 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 특정 날짜의 스케줄 목록 조회
export const fetchDailySchedules = async (storeId: number, date: string): Promise<Schedule[]> => {
  try {
    if (!checkAuthAndSetToken()) {
      console.error("🚨 인증 실패: 일별 스케줄을 가져올 수 없습니다.");
      return [];
    }
    
    const response = await axiosInstance.get<ScheduleResponse>(`/schedules/store/${storeId}/date?date=${date}`);
    console.log(`✅ ${date} 일자 스케줄 데이터 가져옴:`, response.data);
    return response.data.schedules || [];
  } catch (error) {
    console.error(`🚨 ${date} 일자 스케줄 데이터를 가져오는 중 오류 발생:`, error);
    return [];
  }
};
