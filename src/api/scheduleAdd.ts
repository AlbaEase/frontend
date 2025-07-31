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

// 직접 등록