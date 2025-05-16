import { useState, useEffect, useRef } from "react";
import styles from "./EditNameModal.module.css";
import axiosInstance from "../../../api/user";

interface AlarmProps {
  onClose: () => void;
  fullName: string; // ✅ 추가


}

const EditNameModal: React.FC<AlarmProps> = ({ onClose, fullName}) => {

  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const [newFirstName, setNewFirstName] = useState<string>("");
  const [newLastName, setNewLastName] = useState<string>("")

  const handleDone = async () => {
    if (!newFirstName.trim() || !newLastName.trim()) {
      setErrorMessage("성을 포함한 이름을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await axiosInstance.patch("/user/name", {
        newFirstName,
        newLastName,
      });

      console.log("✅ 이름 수정 성공", res.data);
      onClose();
    } catch (error: any) {
      console.error("🚨 이름 수정 실패", error);
      if (error.response?.status === 403) {
        setErrorMessage("권한이 없습니다. 다시 로그인 해주세요.");
      } else {
        setErrorMessage("이름 변경 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>이름 수정하기</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
         <div className={styles.contentContainer}>
          {/* 변경 전 이름 */}
          <div className={styles.contents}>
            <div className={styles.contentsTitle}>변경 전 이름</div>
            <div>{fullName}</div>
          </div>
          <div className={styles.contents}>
            <div className={styles.contentsTitle}>변경 후 이름</div>
            <div className={styles.inputBox}><input
              type="text"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              placeholder="성"
              
            />
            <input
              type="text"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              placeholder="이름"
         
            /></div>
          </div>
          <div onClick={handleDone}> 확인 </div>
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default EditNameModal;
