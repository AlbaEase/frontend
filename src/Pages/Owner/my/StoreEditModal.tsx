import styles from "./StoreEditModal.module.css";
import { useState, useEffect } from "react";
import {
  deleteStore,
  getWorkersByStoreId,
  deleteWorkerFromStore, 
  Worker,
} from "../../../api/albaAdd";
import { useOwnerSchedule } from ".././../../contexts/OwnerScheduleContext"; // 추가된 부분

interface StoreEditModalProps {
  storeId: number;
  storeName: string;
  storeCode: string;
  createdAt: string;
  onClose: () => void;
  onSuccess: (updatedName: string) => void;
}

const StoreEditModal = ({
  storeId,
  storeName,
  storeCode,
  createdAt,
  onClose,
  onSuccess,
}: StoreEditModalProps) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { setSelectedStore } = useOwnerSchedule(); // 🔥 요거 추가!

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await getWorkersByStoreId(storeId);
        setWorkers(response.data);
      } catch (error) {
        console.error("❌ 알바생 목록 불러오기 실패:", error);
      }
    };

    fetchWorkers();
  }, [storeId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`'${storeName}' 매장을 정말 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
      await deleteStore(storeId);
      alert("✅ 매장이 성공적으로 삭제되었습니다.");
      onSuccess(storeName);
      onClose();
    } catch (error) {
      console.error("❌ 매장 삭제 실패:", error);
      alert("⚠️ 매장 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteSelectedWorkers = async () => {
  if (selectedIds.length === 0) {
    alert("삭제할 알바생을 선택해주세요.");
    return;
  }

  const confirmDelete = window.confirm(
    `선택한 알바생 ${selectedIds.length}명을 정말 삭제하시겠습니까?`
  );
  if (!confirmDelete) return;

  try {
    await Promise.all(
      selectedIds.map((id) => deleteWorkerFromStore(storeId, id))
    );
    alert("✅ 선택된 알바생이 삭제되었습니다.");
    setSelectedIds([]);
    const response = await getWorkersByStoreId(storeId); // 목록 새로고침
    setWorkers(response.data);

    setSelectedStore(prev => prev); // 🔥 요거 추가! => context 갱신 트리거
  } catch (error) {
    console.error("❌ 알바생 삭제 실패:", error);
    alert("⚠️ 알바생 삭제 중 오류가 발생했습니다.");
  }
};


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container}>
          <div className={styles.title}>매장 관리하기</div>
          <div className={styles.deleteButton} onClick={handleDelete}>
            매장삭제하기
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.contents}>
            <div className={styles.contentsTitle}>매장명</div>
            <div className={styles.contentsTitle}>{storeName}</div>
          </div>
          <div className={styles.contents}>
            <div className={styles.contentsTitle}>등록 일자</div>
            <div className={styles.contentsTitle}>{createdAt}</div>
          </div>
          <div className={styles.contents}>
            <div className={styles.contentsTitle}>매장 코드</div>
            <div className={styles.contentsTitle}>{storeCode}</div>
          </div>
          <div className={styles.contents}>
            <div className={styles.contentsTitle}>알바생 목록</div>
            <div className={styles.workerList}>
                <div>
              {workers.map((worker) => (
                <div
                  key={worker.userId}
                  className={`${styles.workerItem} ${
                    selectedIds.includes(worker.userId) ? styles.selected : ""
                  }`}
                  onClick={() => toggleSelection(worker.userId)}
                >
                  {worker.name}
                </div>
              ))}
              </div>
              <div className={styles.deleteWorkerButton} onClick={handleDeleteSelectedWorkers}>
                선택 알바생 삭제
              </div>
            </div>
            
          </div>
          <div className={styles.buttonBox}>
            <div>확인</div>
            <div onClick={onClose}>취소</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreEditModal;
