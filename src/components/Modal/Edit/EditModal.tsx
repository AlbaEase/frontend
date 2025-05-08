import { useState, useEffect, useRef } from "react";
import styles from "./EditModal.module.css";
import axiosInstance from "../../../api/user";

interface AlarmProps {
  onClose: () => void;
}

const EditModal: React.FC<AlarmProps> = ({ onClose }) => {
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setPassword(e.target.value);
  };

  const handleCheck = async () => {
    try {
      const res = await axiosInstance.post("/user/verify-password", {
        password,
      });

      console.log("✅ 인증 성공", res.data);
      onClose();
    } catch (error) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    }
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
                className={styles.input}
                value={password}
                onChange={handlePassword}
              />
            </div>
          </div>
          <div onClick={handleCheck}> 확인 </div>
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default EditModal;
