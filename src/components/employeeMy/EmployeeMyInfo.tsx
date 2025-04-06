import styles from "./EmployeeMyInfo.module.css";
import { useState } from "react";

const EmployeeMyInfo = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phoneNumber: "",
    password: "********",
    role: "",
    storeName: "",
  });

  const openModal = () => {
    return <></>;
  };

  return (
    <div className={styles.employeeMyInfo}>
      <div className={styles.title}>
        <div className={styles.titleT}>나의 정보</div>
        <div className={styles.titleEdit} onClick={openModal}>
          내 정보 수정하기
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contents}>
          <div className={styles.contentsTitle}>이름</div>
          <div className={styles.contentsContents}>{userInfo.fullName}</div>
        </div>
        <div className={styles.contents}>
          <div className={styles.contentsTitle}>휴대폰 번호</div>
          <div className={styles.contentsContents}>{userInfo.phoneNumber}</div>
        </div>
        <div className={styles.contents}>
          <div className={styles.contentsTitle}>비밀번호</div>
          <div className={styles.contentsContents}>{userInfo.password}</div>
        </div>
        <div className={styles.contents}>
          <div className={styles.contentsTitle}>직업</div>
          <div className={styles.contentsContents}>{userInfo.role}</div>
        </div>
        <div className={styles.contents}>
          <div className={styles.contentsTitle}>근무 매장</div>
          <div className={styles.contentsContents}>{userInfo.storeName}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMyInfo;
