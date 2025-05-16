import styles from "./EmployeeMyInfo.module.css";
import { useState, useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";
import EditModal from "../Modal/Edit/EditModal";
import DoneModal from "../Modal/Edit/DoneModal";
import EditNameModal from "../Modal/Edit/EditNameModal"; 
import axiosInstance from "../../api/loginAxios"
import EditableField from "../../components/Modal/Edit/EditableField"

const EmployeeMyInfo = () => {
  const { activeModal, openModal, closeModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const handleEditField = (field: string) => {
  if (field === "fullName") {
    setIsEditNameModalOpen(true);
  }
};


  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    password: "********",
    role: "",
    storeNames: [] as string[],
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/user/me");
        console.log("🔍 유저 정보:", response.data);

        setUserInfo({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          password: "********", // 실제 비번은 보여주지 않음
          role: response.data.role || "",
          storeNames: response.data.storeNames || [],
       });
      } catch (error: any) {
        console.error("유저 정보 불러오기 실패:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }
    };

  fetchUserInfo();
}, []);

  return (
    <div className={styles.employeeMyInfo}>
      <div className={styles.title}>
        <div className={styles.titleT}>나의 정보</div>
        <div
          className={styles.titleEdit}
          onClick={() => {
            if (isEditing) {
              openModal("done");
              console.log("수정 완료 버튼 클릭됨");
            } else {
              openModal("edit"); // 비밀번호 확인 모달 열기
            }
          }}
        >
          {isEditing ? "수정 완료" : "내 정보 수정하기"}
        </div>
      </div>
      <div className={styles.content}>
        <EditableField
          label="이름"
          value={userInfo.fullName}
          fieldName="fullName"
          isEditing={isEditing}
          isEditable={true}
          onClick={handleEditField}
        />
        <EditableField
          label="이메일"
          value={userInfo.email}
          fieldName="email"
          isEditing={isEditing}
          isEditable={true}
          onClick={handleEditField}
        />
        <EditableField
          label="비밀번호"
          value={userInfo.password}
          fieldName="password"
          isEditing={isEditing}
          isEditable={true}
          onClick={handleEditField}
        />
        <EditableField
          label="직업"
          value={userInfo.role}
          fieldName="role"
          isEditing={isEditing}
          isEditable={true}
          onClick={handleEditField}
        />
       <EditableField
          label="근무 매장"
          value={userInfo.storeNames.join(", ")} // 배열 처리
          fieldName="storeNames"
          isEditing={isEditing}
          isEditable={true}
          onClick={handleEditField}
        />
      </div>
      {/* activeModal이 "edit"일 때 EditModal 렌더링 */}
      {activeModal === "edit" && <EditModal onClose={closeModal} onSuccess={() => setIsEditing(true)}/>}
      {activeModal === "done" && <DoneModal onClose={closeModal} onSuccess={() => setIsEditing(false)}/>}
       {isEditNameModalOpen && (
      <EditNameModal
        fullName={userInfo.fullName}
        onClose={() => setIsEditNameModalOpen(false)}
        onSave={(newFullName) => {
          setUserInfo((prev) => ({ ...prev, fullName: newFullName }));
          setIsEditNameModalOpen(false);
        }}
      />
    )}
    </div>
  );
};

export default EmployeeMyInfo;
