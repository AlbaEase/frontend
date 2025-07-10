import styles from "./AlbaAddModal.module.css";
import { useState } from "react";
import Button from "../Button";
import { joinStore } from "../../api/albaAdd";
import { useEmployeeSchedule } from "../../contexts/EmployeeScheduleContext"; // ✅ 추가

interface AlbaJoinModalProps {
  onClose: () => void;
}

const AlbaJoinModal: React.FC<AlbaJoinModalProps> = ({ onClose }) => {
  const [storeCode, setStoreCode] = useState<string>("");

  const { refetchStores } = useEmployeeSchedule(); // ✅ 추가

  const handleJoinStore = async () => {
    try {
      const res = await joinStore(storeCode); // 참여 코드로 매장 등록 요청
      alert("매장에 성공적으로 참여했어요!");
      await refetchStores(); // ✅ 매장 목록 다시 불러오기
      onClose(); // 모달 닫기
    } catch (err: any) {
      console.error("❌ 참여 실패", err.response?.data || err.message);
      alert(err.response?.data?.message || "유효하지 않은 참여 코드입니다.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container}>
          <div className={styles.title}>근무지 추가하기</div>
          <div className={styles.button} onClick={onClose}>취소</div>
        </div>

        <div className={styles.content}>
          <div className={styles.contentBox}>
            <div className={styles.contentTitle}>참여 코드 입력</div>
            <div className={styles.contentContent}>
              <input
                type="text"
                value={storeCode}
                onChange={(e) => setStoreCode(e.target.value)}
                className={styles.numberInput}
                placeholder="매장 참여 코드를 입력해 주세요"
              />
            </div>

            <Button width="30%" height="46px" onClick={handleJoinStore}>
              매장 참여하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbaJoinModal;
