import styles from "./RequestModal.module.css";

interface CalendarScheduleProps {
  onClose: () => void;
}
const RequestModal: React.FC<CalendarScheduleProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>근무 요청하기</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.content}></div>
      </div>
    </div>
  );
};

export default RequestModal;
