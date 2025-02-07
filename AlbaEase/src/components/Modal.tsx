import styles from "./Modal.module.css";

const Modal = () => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>근무 요청하기</div>
          <div className={styles.button}>취소</div>
        </div>
        <div className={styles.content}></div>
      </div>
    </div>
  );
};

export default Modal;
