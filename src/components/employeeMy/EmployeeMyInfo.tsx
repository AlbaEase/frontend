import styles from "./EmployeeMyInfo.module.css";
import { useState, useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";
import EditModal from "../Modal/Edit/EditModal";
import DoneModal from "../Modal/Edit/DoneModal";
import axiosInstance from "../../api/loginAxios";
import EditableField from "../../components/Modal/Edit/EditableField";
import EditNameModal from "../Modal/Edit/EditNameModal";
import EditEmailModal from "../Modal/Edit/EditEmailModal";
import EditPasswordModal from "../Modal/Edit/EditPasswordModal";
import DeleteStoreModal from "../Modal/Edit/DeleteStoreModal";

const EmployeeMyInfo = () => {
  const { activeModal, openModal, closeModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  const [storeToDelete, setStoreToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);

  const handleEditField = (field: string) => {
    switch (field) {
      case "fullName":
        setIsEditNameModalOpen(true);
        break;
      case "email":
        setIsEditEmailModalOpen(true);
        break;
      case "password":
        setIsEditPasswordModalOpen(true);
        break;
      case "storeNames":
        setIsEditStoreModalOpen(true);
        break;
    }
  };

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    password: "********",
    role: "",
    stores: [] as { id: number; name: string }[],
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/user/me");
        console.log("🔍 유저 정보:", response.data);

        // user/me에는 storeNames(string[])만 있으므로 storeId가 필요한 경우 /store/me 추가 호출 필요
        const storeResponse = await axiosInstance.get("/store/me");
        const storeData = storeResponse.data || [];

        const formattedStores = storeData.map((store: any) => ({
          id: store.storeId,
          name: store.name,
        }));

        setUserInfo({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          password: "********",
          role: response.data.role || "",
          stores: formattedStores,
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
            isEditing ? openModal("done") : openModal("edit");
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
          fieldName="storeNames"
          isEditing={isEditing}
          isEditable={true}
          onClick={handleEditField}
        >
          <div className={styles.storeList}>
            {userInfo.stores.map((store) => (
              <div key={store.id} className={styles.storeItem}>
                <span className={styles.storeName}>{store.name}</span>
                {isEditing && (
                  <span
                    className={styles.manageButton}
                    onClick={() => {
                      console.log("🧩 매장 관리 클릭됨:", store);
                      setStoreToDelete({ id: store.id, name: store.name });
                    }}
                  >
                    매장 관리
                  </span>
                )}
              </div>
            ))}
          </div>
        </EditableField>
      </div>

      {/* ✅ 모달들 */}
      {activeModal === "edit" && (
        <EditModal onClose={closeModal} onSuccess={() => setIsEditing(true)} />
      )}
      {activeModal === "done" && (
        <DoneModal onClose={closeModal} onSuccess={() => setIsEditing(false)} />
      )}

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

      {isEditEmailModalOpen && (
        <EditEmailModal
          onClose={() => setIsEditEmailModalOpen(false)}
          onSuccess={(email) => {
            setUserInfo((prev) => ({ ...prev, email }));
            setIsEditEmailModalOpen(false);
          }}
        />
      )}

      {isEditPasswordModalOpen && (
        <EditPasswordModal
          onClose={() => setIsEditPasswordModalOpen(false)}
          onSuccess={() => {
            setUserInfo((prev) => ({ ...prev, password: "********" }));
            setIsEditPasswordModalOpen(false);
          }}
        />
      )}

      {/* ✅ 삭제 모달 */}
      {storeToDelete && (
        <DeleteStoreModal
          storeId={storeToDelete.id}
          storeName={storeToDelete.name}
          onClose={() => setStoreToDelete(null)}
          onSuccess={() => {
            setUserInfo((prev) => ({
              ...prev,
              stores: prev.stores.filter((s) => s.id !== storeToDelete.id),
            }));
            setStoreToDelete(null);
            // ❌ setIsEditing(false) 제거 => 수정모드 유지!
          }}
        />
      )}
    </div>
  );
};

export default EmployeeMyInfo;
