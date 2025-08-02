// 사장님 근무등록하기 모달창
// 사장님 근무등록하기 모달창
import { useState, useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";
import TemplateSelector from "./TemplateSelector";
import ManualScheduleForm from "./ManualScheduleForm";
import TemplateCreateForm from "./TemplateCreateForm";
import TemplateScheduleForm from "./TemplateScheduleForm";
import styles from "./ScheduleAddModal.module.css";

const ScheduleAddModal = () => {
  console.log("📌 ScheduleAddModal 렌더링됨");

  const { closeModal } = useModal();

  type ViewState =
    | { type: "default" }
    | { type: "manual" }
    | { type: "template" }
    | { type: "templateForm"; templateId: number };

  const [viewState, setViewState] = useState<ViewState>({ type: "default" });

  useEffect(() => {
    setViewState({ type: "default" });
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>
            {viewState.type === "manual" && "근무 직접 등록"}
            {viewState.type === "template" && "근무 템플릿 생성하기"}
            {viewState.type === "templateForm" && "템플릿으로 근무 등록"}
            {viewState.type === "default" && "근무 등록하기"}
          </div>
          <div className={styles.button} onClick={closeModal}>
            취소
          </div>
        </div>

        <div className={styles.contents}>
          {viewState.type === "default" && (
            <TemplateSelector onNext={setViewState} />
          )}
          {viewState.type === "manual" && (
            <ManualScheduleForm onBack={() => setViewState({ type: "default" })} />
          )}
          {viewState.type === "template" && (
            <TemplateCreateForm onBack={() => setViewState({ type: "default" })} />
          )}
          {viewState.type === "templateForm" && (
            <TemplateScheduleForm
              templateId={viewState.templateId}
              onBack={() => setViewState({ type: "default" })}
              onSuccess={() => closeModal()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleAddModal;