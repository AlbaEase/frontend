import styles from "./AlbaAddModal.module.css";
import { useState } from "react";
import Button from "../Button";
import { validateBusinessNumber } from "../../api/albaAdd";

interface AlbaAddModalProps {
  onClose: () => void;
}

const AlbaAddModal: React.FC<AlbaAddModalProps> = ({ onClose }) => {
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleBusinessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    if (value.length > 5) value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
    else if (value.length > 3) value = `${value.slice(0, 3)}-${value.slice(3)}`;
    setBusinessNumber(value);
    setValidationError("");
  };

  const handleValidateBusinessNumber = async () => {
    const cleanNumber = businessNumber.replace(/-/g, "");

    if (cleanNumber.length !== 10) {
      setValidationError("사업자등록번호는 10자리 숫자여야 합니다.");
      return;
    }

    try {
      setIsValidating(true);
      await validateBusinessNumber(cleanNumber);
      alert("유효한 사업자등록번호입니다.");
      setValidationError("");
    } catch (error) {
      console.error("사업자등록번호 검증 실패:", error);
      setValidationError("유효하지 않은 사업자등록번호입니다.");
    } finally {
      setIsValidating(false);
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
          <div className={styles.contentBox}>
            <div className={styles.contentTitle}>매장 사업자번호 입력</div>
            <div className={styles.contentContent}>
              <input
                type="text"
                value={businessNumber}
                onChange={handleBusinessNumber}
                className={styles.numberInput}
                placeholder="매장의 사업자번호를 입력해 주세요 (000-00-00000)"
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
        </div>
      </div>
    </div>
  );
};

export default AlbaAddModal;
