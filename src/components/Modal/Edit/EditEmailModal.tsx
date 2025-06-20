import { useState, useEffect, useRef } from "react";
import styles from "./EditEmailModal.module.css";
import axiosInstance from "../../../api/user";

interface AlarmProps {
  onClose: () => void;
  onSuccess:(email: string)=> void
}

const EditEmailModal: React.FC<AlarmProps> = ({ onClose, onSuccess}) => {

  const [errorMessage, setErrorMessage] = useState<string>("");
  // 이 모달창에서는 이름과 달리 기존의 email을 작성하는 것이 아님
  // 기존의 email 대신 변경할 email을 작성
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [step, setStep] = useState<number>(1); // step 1: 이메일 입력, step 2: 인증번호 확인
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false); // 인증번호가 발송되었는지 여부
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false); // 인증번호 확인 여부

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(e.target.value);
  };
  const handleVerificationCode =  (e: React.ChangeEvent<HTMLInputElement>) =>{
    setVerificationCode(e.target.value);
  };
  const handleNext = async () => {
    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }
    console.log("보낼 이메일:", email);

    try {
      // 이메일 변경 요청 API 호출
      await axiosInstance.post("/user/change-email", {
        email,
      });

      setIsCodeSent(true); // 인증번호 발송 성공
      setStep(2); // 다음 단계로 이동
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("이메일 전송 실패. 다시 시도해주세요.");
    }
  };
  const handleNext2 = async () => {
    if (!email || !verificationCode) {
      setErrorMessage("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }

    try {
      await axiosInstance.post("/user/verify-new-email", {
        email,
        verificationCode,
      });

      setErrorMessage("");
      alert("이메일이 성공적으로 인증되었습니다.");
      onSuccess(email)
      onClose(); // 모달 닫기 등 원하는 후속 처리
    } catch (error) {
      console.error("인증 실패:", error);
      setErrorMessage("인증번호가 올바르지 않거나 유효 시간이 지났습니다.");
    }
  };



  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>이메일 수정하기</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
         <div className={styles.contentContainer}>
          {/* 변경 전 이름 */}
        {step === 1 && (
          <>
          <div className={styles.contents}>
            <div className={styles.contentsTitle}>변경할 이메일</div>
            <div className={styles.contentsEmail}>
              <input
                value={email}
                onChange={handleEmail}
                placeholder="새로운 이메일을 작성하시오."
                className={styles.contentsEmail}
                />
            </div>
          </div>
          <div className={styles.contents2}>
            <div className={styles.contentsTitle}>인증번호</div>
            <div className={styles.contentsEmail}>
              <input
                value={verificationCode}
                onChange={handleVerificationCode}
                placeholder="인증번호를 작성하시오."
                className={styles.contentsEmail}
                />
            </div>
          </div>
          <div className={styles.vbutton} onClick={handleNext}>인증번호 받기</div>
       </>)}
        {step == 2 &&(
          <>
            <div className={styles.contents}>
            <div className={styles.contentsTitle}>변경할 이메일</div>
            <div className={styles.contentsEmail}>
              <input
                value={email}
                onChange={handleEmail}
                placeholder="새로운 이메일을 작성하시오."
                className={styles.contentsEmail}
                />
            </div>
          </div>
          <div className={styles.contents2}>
            <div className={styles.contentsTitle}>인증번호</div>
            <div className={styles.contentsEmail}>
              <input
                value={verificationCode}
                onChange={handleVerificationCode}
                placeholder="인증번호를 작성하시오."
                className={styles.contentsEmail}
                />
            </div>
          </div>
          <div className={styles.vbutton} onClick={handleNext2}>이메일 인증하기</div>
          </>
        )}
        {step == 3 &&(
          <>
          
          </>
         )}
          </div>
         
        </div>
      </div>
  );
};

export default EditEmailModal;
