import { useModal } from "../../contexts/ModalContext";
import styles from "./ScheduleAddModal.module.css"


const ScheduleAddModal = () => {
    const { closeModal } = useModal();

    return(
        <div className={styles.modalOverlay}> 
            <div className={styles.modal}>
                <div className={styles.container} style={{ marginTop: "20px" }}>
                    <div className={styles.title}>근무 등록하기</div>
                    <div className={styles.button} onClick={ closeModal }>취소</div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleAddModal;