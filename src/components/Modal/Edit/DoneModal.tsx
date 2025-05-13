import { useState, useEffect, useRef } from "react";
import styles from "./DoneModal.module.css";
import axiosInstance from "../../../api/user";

interface AlarmProps {
  onClose: () => void;
  onSuccess: () => void;
}

const DoneModal: React.FC<AlarmProps> = ({ onClose, onSuccess }) => {

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDone = async () => {
    try {
      const res = await axiosInstance.post("/user/complete-edit", {
  
      });

      console.log("✅ 인증 성공", res.data);
      onSuccess();
      onClose();
    } catch (error) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>정보 수정하기 종료</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contents}>
            <div>정보 수정을 종료하시겠습니까?</div>
          </div>
          <div onClick={handleDone}> 확인 </div>
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default DoneModal;
