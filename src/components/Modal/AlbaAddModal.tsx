import styles from "./AlbaAddModal.module.css";
import { useState } from "react";
import Button from "../Button";
import { validateBusinessNumber, registerStore } from "../../api/albaAdd";

interface AlbaAddModalProps {
  onClose: () => void;
}

const AlbaAddModal: React.FC<AlbaAddModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);

  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [defaultHourlyWage, setDefaultHourlyWage] = useState<number>(0);

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleBusinessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // 숫자만 허용, 하이픈 제거
    setBusinessNumber(value);
    setValidationError("");
  };

  const handleValidateBusinessNumber = async () => {
    if (businessNumber.length !== 10) {
      setValidationError("사업자등록번호는 10자리 숫자여야 합니다.");
      return;
    }

    try {
      setIsValidating(true);
      await validateBusinessNumber(businessNumber);
      alert("유효한 사업자등록번호입니다.");
      setValidationError("");
      setStep(2); // step 2로 이동
    } catch (error) {
      console.error("사업자등록번호 검증 실패:", error);
      setValidationError("유효하지 않은 사업자등록번호입니다.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRegisterStore = async () => {
    if (!storeName || !location || !defaultHourlyWage) {
      setValidationError("모든 값을 입력해주세요.");
      return;
    }

    const payload = {
      name: storeName,
      location: location,
      businessNumber: businessNumber,
      defaultHourlyWage: defaultHourlyWage,
    };

    console.log("📦 registerStore로 보낼 데이터:", payload);

    try {
      await registerStore(payload);
      alert("매장이 성공적으로 등록되었습니다.");
      onClose();
    } catch (error: any) {
      console.error("매장 등록 실패:", error);
      if (error.response?.data) {
        console.error("❗서버 응답 메시지:", error.response.data);
      }
      setValidationError("매장 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container}>
          <div className={styles.title}>근무지 등록하기</div>
          <div className={styles.button} onClick={onClose}>취소</div>
        </div>

        <div className={styles.content}>
          {/* Step 1: 사업자등록번호 입력 */}
          <div className={styles.contentBox}>
            <div className={styles.contentTitle}>매장 사업자번호 입력</div>
            <div className={styles.contentContent}>
              <input
                type="text"
                value={businessNumber}
                onChange={handleBusinessNumber}
                className={styles.numberInput}
                placeholder="매장의 사업자번호를 입력해 주세요 (숫자만 입력)"
              />
              <button 
                className={styles.inputButton} 
                onClick={handleValidateBusinessNumber}
                disabled={isValidating}
              >
                {isValidating ? "검증 중..." : "입력 완료"}
              </button>
            </div>
            {validationError && <div className={styles.errorMessage}>{validationError}</div>}
          </div>

          {/* Step 2: 매장 정보 입력 */}
          {step === 2 && (
            <>
              <div className={styles.contentBox}>
                <div className={styles.contentTitle}>매장 이름</div>
                <div className={styles.contentContent}>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className={styles.numberInput}
                    placeholder="매장 이름을 입력해 주세요"
                  />
                </div>
              </div>

              <div className={styles.contentBox}>
                <div className={styles.contentTitle}>매장 위치</div>
                <div className={styles.contentContent}>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={styles.numberInput}
                    placeholder="매장 위치를 입력해 주세요 (예: 서울 송파구)"
                  />
                </div>
              </div>

              <div className={styles.contentBox}>
                <div className={styles.contentTitle}>기본 시급</div>
                <div className={styles.contentContent}>
                  <input
                    type="number"
                    value={defaultHourlyWage}
                    onChange={(e) => setDefaultHourlyWage(Number(e.target.value))}
                    className={styles.numberInput}
                    placeholder="기본 시급을 입력해 주세요 (예: 9860)"
                  />
                </div>
              </div>

              <div className={styles.registerButtonBox}>
                <Button width="30%" height="46px" onClick={handleRegisterStore}>
                  매장 등록하기
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbaAddModal;
