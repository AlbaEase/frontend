// API 응답 및 요청 타입 정의

// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  fullName?: string;
  name?: string;
  role: string;
  userType?: string;
  storeId?: number;
  storeName?: string;
  userId?: number;
}

export interface UserResponse {
  user: User;
}

// 알림 관련 타입
export interface Notification {
  id: number;
  userId: number;
  type: 'ALL_USERS' | 'SPECIFIC_USER';
  message: string;
  readStatus: 'READ' | 'UNREAD';
  createdAt: string;
  scheduleId?: number;
  details?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
}

// 근무 변경 요청 관련 타입
export interface ModificationRequest {
  scheduleId: number;
  details: string;
}

export interface ModificationResponse {
  modificationId: number;
  userId: number;
  scheduleId: number;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  userName?: string;
  schedule?: Schedule;
}

// 근무 변경 요청 목록 표시용 타입
export interface ModificationDisplay {
  id: number;
  workDate: string;
  requester: string;
  substitute: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// 대타 요청 관련 타입
export interface ShiftRequest {
  fromUserId?: number;
  toUserId?: number;
  scheduleId: number;
  requestType: 'SPECIFIC_USER' | 'ALL_USERS';
  requestDate: string;
}

export interface ShiftResponse {
  shiftId: number;
  fromUserId: number;
  toUserId?: number;
  scheduleId: number;
  requestType: 'SPECIFIC_USER' | 'ALL_USERS';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  createdAt: string;
  updatedAt: string;
  fromUserName?: string;
  toUserName?: string;
  schedule?: Schedule;
}

// 스케줄 관련 타입
export interface Schedule {
  scheduleId: number;
  userId: number;
  storeId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  breakTime?: string;
  userName?: string;
  storeName?: string;
}

export interface ScheduleResponse {
  schedules: Schedule[];
} 