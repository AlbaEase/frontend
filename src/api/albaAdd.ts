import axiosInstance from "./axios";

interface AddStoreRequest {
  name: string;
  location: string;
  businessNumber: string;
  storeCode: string;
  requireApproval: boolean;
  defaultHourlyWage: number;
}

export const validateBusinessNumber = (businessNumber: string) => {
  console.log("✅ 현재 baseURL 확인:", import.meta.env.VITE_API_URL);

  return axiosInstance.post("/store/validate-business-number", { businessNumber });
};


export const registerStore = (data: AddStoreRequest) => {
  return axiosInstance.post("/store", data);
};
