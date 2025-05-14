import styles from "./AlbaAddModal.module.css";
import { useState } from "react";
import axiosInstance from "../../api/loginAxios";
import { API_URL } from "../../utils/config";

interface AlbaAddProps {
  onClose: () => void;
}

const AlbaAddModal: React.FC<AlbaAddProps> = ({ onClose }) => {
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [shop, setShop] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false);

  const handleBusinessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 하이픈 자동 추가 (123-45-67890 형식)
    let formattedValue = value.replace(/[^0-9]/g, "");
    if (formattedValue.length > 3 && formattedValue.length <= 5) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3)}`;
    } else if (formattedValue.length > 5) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 5)}-${formattedValue.slice(5, 10)}`;
    }
    
    setBusinessNumber(formattedValue);
    // 입력 필드가 변경되면 오류 메시지와 유효성 상태 초기화
    setValidationError("");
    setValidationSuccess(false);
  };

  const handleStoreName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShop(e.target.value);
  };

  const validateBusinessNumber = async (businessNumber: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setValidationError("");
      
      // 숫자만 추출
      const cleanNumber = businessNumber.replace(/-/g, "");
      
      // 기본 형식 검증
      if (cleanNumber.length !== 10) {
        setValidationError("사업자등록번호는 10자리 숫자여야 합니다.");
        return false;
      }
      
      // API 호출 전 형식 확인 - 실제 API가 있다고 가정
      try {
        // 백엔드 API로 사업자번호 검증 요청
        const response = await axiosInstance.get(`${API_URL}/store/validate-business-number?number=${cleanNumber}`);
        
        if (response.data && response.data.valid) {
          setValidationSuccess(true);
          console.log("✅ 사업자번호 검증 성공:", response.data);
          return true;
        } else {
          setValidationError(response.data?.message || "유효하지 않은 사업자등록번호입니다.");
          return false;
        }
      } catch (error) {
        console.error("사업자번호 검증 API 오류:", error);
        
        // 개발 중 API가 없는 경우 임시 검증 로직
        if (import.meta.env.DEV) {
          // 개발 환경에서는 간단한 형식 검증만 수행
          const isValidFormat = /^\d{3}-\d{2}-\d{5}$/.test(businessNumber);
          if (isValidFormat) {
            setValidationSuccess(true);
            console.log("✅ 개발 환경: 사업자번호 형식 검증 통과");
            return true;
          } else {
            setValidationError("올바른 사업자등록번호 형식이 아닙니다. (예: 123-45-67890)");
            return false;
          }
        }
        
        setValidationError("사업자등록번호 검증 중 오류가 발생했습니다.");
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStoreByBusinessNumber = async () => {
    if (!businessNumber) {
      setValidationError("사업자등록번호를 입력해주세요.");
      return;
    }
    
    // 하이픈 제거
    const cleanNumber = businessNumber.replace(/-/g, '');
    
    // 사업자번호 검증
    const isValid = await validateBusinessNumber(businessNumber);
    
    if (!isValid) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 백엔드 API로 매장 정보 조회
      const response = await axiosInstance.get(`${API_URL}/store/find-by-business-number?number=${cleanNumber}`);
      
      if (response.data && response.data.name) {
        setShop(response.data.name);
        setIsOpen(true);
        console.log("✅ 매장 정보 조회 성공:", response.data);
      } else {
        // 검증은 성공했지만 DB에 없는 사업자번호일 경우 매장명 입력 기능 추가
        setValidationError("확인된 사업자번호이나 등록된 매장 정보가 없습니다. 매장명을 직접 입력해주세요.");
        setShop("");
        setIsOpen(true);
      }
    } catch (error) {
      console.error("매장 정보 조회 오류:", error);
      
      // 개발 중 API가 없는 경우 임시 로직
      if (import.meta.env.DEV) {
        setValidationError("개발 환경: 매장 정보를 직접 입력해주세요.");
        setShop("");
        setIsOpen(true);
      } else {
        setValidationError("매장 정보 조회 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!shop) {
      setValidationError("매장명을 입력해주세요.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 매장 등록 API 호출
      const cleanNumber = businessNumber.replace(/-/g, "");
      
      const response = await axiosInstance.post(`${API_URL}/store/register`, {
        businessNumber: cleanNumber,
        name: shop
      });
      
      console.log("✅ 매장 등록 성공:", response.data);
      
      // 성공 후 모달 닫기
      onClose();
    } catch (error) {
      console.error("매장 등록 오류:", error);
      setValidationError("매장 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modal_title}>
          <div className={styles.title}>매장 추가</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.input_container}>
            <div className={styles.input_title}>사업자등록번호</div>
            <div className={styles.input_container_flex}>
              <input
                className={styles.input}
                type="text"
                placeholder="사업자등록번호 10자리"
                value={businessNumber}
                onChange={handleBusinessNumber}
                maxLength={12} // 000-00-00000 형식으로 최대 12자
                disabled={isLoading}
              />
              <button 
                className={`${styles.button2} ${isLoading ? styles.loading : ''}`} 
                onClick={fetchStoreByBusinessNumber}
                disabled={isLoading}
              >
                {isLoading ? "조회 중..." : "조회"}
              </button>
            </div>
            {validationError && (
              <div className={styles.validation_error}>{validationError}</div>
            )}
            {validationSuccess && !validationError && (
              <div className={styles.validation_success}>유효한 사업자등록번호입니다.</div>
            )}
          </div>

          {isOpen && (
            <div className={styles.input_container}>
              <div className={styles.input_title}>매장명</div>
              <input
                className={styles.input}
                type="text"
                placeholder="매장명을 입력해주세요"
                value={shop}
                onChange={handleStoreName}
                disabled={isLoading}
              />
              <div
                className={`${styles.save_button} ${isLoading ? styles.loading : ''}`}
                onClick={handleSave}
              >
                {isLoading ? "저장 중..." : "저장"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbaAddModal;
