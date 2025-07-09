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
