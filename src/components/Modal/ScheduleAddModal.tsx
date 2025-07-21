import { useState } from "react";
import { useModal } from "../../contexts/ModalContext";
import Button from "../Button";
import styles from "./ScheduleAddModal.module.css";

const ScheduleAddModal = () => {
  const { closeModal } = useModal();
  const [viewType, setViewType] = useState<"default" | "manual" | "template">("default");

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{marginTop : "20px"}}>
          <div className={styles.title}>
            {viewType === "manual" && "근무 직접 등록"}
            {viewType === "template" && "근무 템플릿 생성하기"}
            {viewType === "default" && "근무 등록하기"}
          </div>
          <div className={styles.button} onClick={closeModal}>취소</div>
        </div>

        {viewType === "default" && (
        <div className={styles.contents}>
            <div className={styles.templeteBox}>

            </div>
            <div className={styles.buttonBox}>
                <Button onClick={() => setViewType("manual")}>직접 등록하기</Button>
                <Button onClick={() => setViewType("template")} variant="gray">템플릿 생성하기</Button>
            </div>
        </div>
        )}

        {viewType === "manual" && (
          <div className={styles.contents}>
            <div>근무 직접 등록 폼</div>
            <Button onClick={() => setViewType("default")}>이전</Button>
          </div>
        )}

        {viewType === "template" && (
          <div className={styles.contents}>
            <div>근무 템플릿 생성 폼</div>
            <Button onClick={() => setViewType("default")}>이전</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleAddModal;
