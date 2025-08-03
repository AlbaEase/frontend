import axiosInstance from "./axios";

interface AddStoreRequest {
  name: string;
  location: string;
  businessNumber: string;
}
//사업자번호 유효성 검사
export const validateBusinessNumber = (businessNumber: string) => {
  console.log("✅ 현재 baseURL 확인:", import.meta.env.VITE_API_URL);

  return axiosInstance.post("/store/validate-business-number", { businessNumber });
};

// 사장님이 매장 등록
export const registerStore = (data: AddStoreRequest) => {
  console.log("📤 [API] registerStore payload:", data); // ✅ 여기도 찍어볼 수 있음
  return axiosInstance.post("/store", data);
};

// 알바생이 매장 등록
export const joinStore = (storeCode: string) => {
  console.log("📤 [API] joinStore payload:", storeCode);
  return axiosInstance.post("/store/join", { storeCode });
};

// 매장 삭제
export const deleteStore = (storeId: number) => {
  return axiosInstance.delete(`/store/${storeId}`);
};

// 알바생 불러오기
export interface Worker{
  userId: number;
  name: string;
}

export const getWorkersByStoreId = (storeId: number) => {
  return axiosInstance.get<Worker[]>(`/store/${storeId}/workers`);
};

// 내가 일하는 매장 목록 조회
export interface StoreInfo {
  id: number;
  storeId: number;
  storeCode: string;
  businessNumber: string;
  name: string;
  location: string;
  requireApproval: boolean;
  defaultHourlyWage: number;
  createdAt: string;
}

export const getMyStores = () => {
  return axiosInstance.get<StoreInfo[]>(`/store/me`);
};

// 일자리 정보 수정
export interface UpdateStoreRequest {
  name: string;
  location: string;
  contactNumber: string;
}

export const updateStore = (storeId: number, data: UpdateStoreRequest) => {
  return axiosInstance.put(`/store/${storeId}`, data);
};


// 특정 매장에서 알바생 삭제
export const deleteWorkerFromStore = (storeId: number, userId: number) => {
  return axiosInstance.delete(`/store/${storeId}/worker/${userId}`);
};
