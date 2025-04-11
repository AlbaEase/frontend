import { useState, useEffect, useRef } from "react";
import styles from "./EditModal.module.css";

interface AlarmProps {
  onClose: () => void;
}

const EditModal: React.FC<AlarmProps> = ({ onClose }) => {
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCheck = () => {
    return;
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>정보 수정하기</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contents}>
            <div>본인확인을 위한 비밀번호를 입력해 주세요</div>
            <div>
              <input
                type="password"
                value={password}
                className={styles.input}
              />
            </div>
          </div>
          <div onClick={handleCheck}> 확인 </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
