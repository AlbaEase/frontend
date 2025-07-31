// ScheduleAddModal.tsx
import { useState } from "react";
import { useModal } from "../../contexts/ModalContext";
import TemplateSelector from "./TemplateSelector"; // 과정 분리하는 버튼 있는 곳
import ManualScheduleForm from "./ManualScheduleForm"; // 직접 등록 
import TemplateCreateForm from "./TemplateCreateForm"; // 템플릿 생성
import styles from "./ScheduleAddModal.module.css";

const ScheduleAddModal = () => {
  const { closeModal } = useModal();
  const [viewType, setViewType] = useState<"default" | "manual" | "template">("default");

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>
            {viewType === "manual" && "근무 직접 등록"}
            {viewType === "template" && "근무 템플릿 생성하기"}
            {viewType === "default" && "근무 등록하기"}
          </div>
          <div className={styles.button}>확인</div>
          <div className={styles.button} onClick={closeModal}>취소</div>
        </div>

        <div className={styles.contents}>
          {viewType === "default" && <TemplateSelector onNext={setViewType} />}
          {viewType === "manual" && <ManualScheduleForm onBack={() => setViewType("default")} />}
          {viewType === "template" && <TemplateCreateForm onBack={() => setViewType("default")} />}
        </div>
      </div>
    </div>
  );
};

export default ScheduleAddModal;
