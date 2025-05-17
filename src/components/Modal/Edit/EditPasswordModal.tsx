import { useState, useEffect, useRef } from "react";
import styles from "./EditPasswordModal.module.css";
import axiosInstance from "../../../api/user";

interface AlarmProps {
  onClose: () => void;
  onSuccess: () => void;
}

const EditPasswordModal: React.FC<AlarmProps> = ({ onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordCheck, setNewPasswordCheck] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  const handlecurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setCurrentPassword(e.target.value);
  };
  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setNewPassword(e.target.value);
  };
  const handleNewPasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setNewPasswordCheck(e.target.value);
  };

  const handleCheck = async () => {
    try {
      const res = await axiosInstance.post("/user/verify-password", {
        currentPassword,
      });

      console.log("✅ 인증 성공", res.data);
      setErrorMessage("");
      setStep(2); // ✅ 다음 단계로 이동
    } catch (error) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    }
  };

    const handleChangePassword = async () => {
    if (newPassword !== newPasswordCheck) {
        setErrorMessage("새 비밀번호가 일치하지 않습니다.");
        return;
    }
        console.log("보낼 요청", {
        newPassword,
        confirmNewPassword: newPasswordCheck,
});
    try {
        const res = await axiosInstance.patch("/user/password", {
        newPassword,
        confirmNewPassword: newPasswordCheck, // <- key 이름 중요!
        });

        console.log("✅ 비밀번호 변경 성공", res.data);
        alert("비밀번호가 성공적으로 변경되었습니다.");
        onSuccess();
        onClose();
    } catch (error: any) {
        console.error("🚨 비밀번호 변경 실패", error.response?.data || error.message);
        setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
    }
    };


  return (
    
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>비밀번호 수정하기</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.contentContainer}>
        {step == 1 && (<>
          <div className={styles.contents}>
            <div>현재 비밀번호</div>
            <div>
              <input
                type="password"
                className={styles.input}
                value={currentPassword}
                onChange={handlecurrentPassword}
              />
            </div>
          </div>
          <div onClick={handleCheck} className={styles.button1}> 확인 </div>
          {errorMessage && <div>{errorMessage}</div>}
          </>)}
          {step ==2 &&(
            <>
            <div className={styles.contents}>
            <div>변경할 비밀번호</div>
            <div>
              <input
                type="password"
                className={styles.input}
                value={newPassword}
                onChange={handleNewPassword}
              />
            </div>
          </div>
           <div className={styles.contents2}>
            <div>변경할 비밀번호 확인</div>
            <div>
              <input
                type="password"
                className={styles.input}
                value={newPasswordCheck}
                onChange={handleNewPasswordCheck}
              />
            </div>
          </div>
          <div onClick={handleChangePassword} className={styles.button2}> 확인 </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPasswordModal;
