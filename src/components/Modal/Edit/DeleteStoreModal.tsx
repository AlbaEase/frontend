import { useState } from "react";
import styles from "./DeleteStoreModal.module.css";
import { deleteStore } from "../../../api/albaAdd"; // 경로는 실제 위치에 맞게 조절

interface AlarmProps {
  storeId: number;              // ✅ 추가: 실제 API 호출용
  storeName: string;           // ✅ 기존 그대로 유지
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteStoreModal: React.FC<AlarmProps> = ({
  storeId,
  storeName,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteStore(storeId);           // ✅ API 호출
      onSuccess();                          // ✅ 성공 후 콜백
    } catch (error) {
      console.error("❌ 매장 삭제 실패:", error);
      alert("매장 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container}>
          <div className={styles.title}>매장 삭제하기</div>
          <div className={styles.button} onClick={onClose}>취소</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contents}>
            정말 <strong>{storeName}</strong> 매장을 삭제하시겠습니까?
          </div>
          <div className={styles.confirmButton} onClick={handleDelete}>
            {isLoading ? "삭제 중..." : "확인"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteStoreModal;
