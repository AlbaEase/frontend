import styles from "./EmployeeMyInfo.module.css";
import { useState, useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";
import EditModal from "../Modal/Edit/EditModal";
import axiosInstance from "../../api/axios"; // ✅ axios 설정 import

const EmployeeMyInfo = () => {
  const { activeModal, openModal, closeModal } = useModal();

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    password: "********",
    role: "",
    storeName: "",
  });

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/user/me");
        const { fullName, email, role, storeNames } = response.data;
        setUserInfo({
          fullName,
          email,
          password: "********",
          role,
          storeName: storeNames?.[0] || "없음", // 첫 번째 매장만 표시하거나 없으면 "없음"
        });
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);



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
          <div className={styles.contentsTitle}>이메일</div>
          <div className={styles.contentsContents}>{userInfo.email}</div>
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
