import axiosInstance from "./axios";

interface AddStoreRequest {
  name: string;
  location: string;
  businessNumber: string;
}

export const validateBusinessNumber = (businessNumber: string) => {
  console.log("✅ 현재 baseURL 확인:", import.meta.env.VITE_API_URL);

  return axiosInstance.post("/store/validate-business-number", { businessNumber });
};


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
