import styles from "./EmployeeMyInfo.module.css";
import { useState } from "react";
import { useModal } from "../../contexts/ModalContext";
import EditModal from "../Modal/EditModal";

const EmployeeMyInfo = () => {
  const { activeModal, openModal, closeModal } = useModal();

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phoneNumber: "",
    password: "********",
    role: "",
    storeName: "",
  });

  return (
    <div className={styles.employeeMyInfo}>
      <div className={styles.title}>
        <div className={styles.titleT}>나의 정보</div>

        <div className={styles.titleEdit} onClick={() => openModal("edit")}>
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
      {/* activeModal이 "edit"일 때 EditModal 렌더링 */}
      {activeModal === "edit" && <EditModal onClose={closeModal} />}
    </div>
  );
};

export default EmployeeMyInfo;
