import { useState, useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";
import TemplateSelector from "./TemplateSelector";
import ManualScheduleForm from "./ManualScheduleForm";
import TemplateCreateForm from "./TemplateCreateForm";
import TemplateScheduleForm from "./TemplateScheduleForm";
import styles from "./ScheduleAddModal.module.css";

const ScheduleAddModal = () => {
  console.log("\ud83d\udccc ScheduleAddModal \ub80c\ub354\ub9c1\ub428");

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
            {viewState.type === "manual" && "\uadfc\ubb34 \uc9c1\uc811 \ub4f1\ub85d"}
            {viewState.type === "template" && "\uadfc\ubb34 \ud15c\ud50c\ub9bf \uc0dd\uc131\ud558\uae30"}
            {viewState.type === "templateForm" && "\ud15c\ud50c\ub9bf\uc73c\ub85c \uadfc\ubb34 \ub4f1\ub85d"}
            {viewState.type === "default" && "\uadfc\ubb34 \ub4f1\ub85d\ud558\uae30"}
          </div>
          <div className={styles.button} onClick={closeModal}>\ucde8\uc18c</div>
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
              onSuccess={() => {
                closeModal();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleAddModal;