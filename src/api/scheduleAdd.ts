import axiosInstance from "./axios";
// 템플릿 조회
// scheduleAdd.ts
export interface TimeObj {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface ScheduleTemplate {
  templateId: number;
  storeId: number;
  templateName: string;
  startTime: TimeObj;
  endTime: TimeObj;
  breakTime: TimeObj;
}

export const getTemplatesByStoreId = async (storeId: number): Promise<ScheduleTemplate[]> => {
  const response = await axiosInstance.get(`/template/store/${storeId}`);
  return response.data;
};


// 템플릿 등록
export interface CreateTemplateRequest {
  templateName: string;
  startTime: string;
  endTime: string;
  breakTime: string;
}

export const postTemplate = async (storeId: number, data: CreateTemplateRequest) => {
  const res = await axiosInstance.post(`/template/store/${storeId}`, data);
  return res.data;
};


// 직접 등록
export interface ScheduleRequest {
  userIds: number[];
  storeId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  breakTime: string;
  repeatDays?: string[];
  repeatEndDate?: string;
}

export const postManualSchedule = async (storeId: number, data: ScheduleRequest) => {
  const response = await axiosInstance.post(`/schedule/store/${storeId}`, data);
  return response.data;
};