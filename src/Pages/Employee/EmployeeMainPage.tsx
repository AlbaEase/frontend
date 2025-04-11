import { useModal } from "../../contexts/ModalContext";
import Alarm from "../../components/Alarm";
import AlbaAdd from "../../components/AlbaAdd";
import Calendar from "../../components/Calendar";
import Choice from "../../components/Choice";
import Header from "../../components/Header";
import PartTime from "../../components/PartTime";
import SelectRadio from "../../components/SelectRadio";
import AlbaAddModal from "../../components/Modal/AlbaAddModal";
import AlarmModal from "../../components/Modal/AlarmModal";
import RequestModal from "../../components/Modal/RequestModal";
import styles from "./EmployeeMainPage.module.css";
import MyHeader from "../../components/employeeMy/MyHeader";

const EmployeeMainPage = () => {
  /* 모달창 컨텍스트 생성 */
  const { activeModal, openModal, closeModal } = useModal();

  return (
    <div className={styles.background}>
      <div className={styles.ownerMainPage}>
        <MyHeader />
        <div className={styles.mainContents}>
          <PartTime />
          <Calendar />
          <Choice />
        </div>
        <div className={styles.bottomContents}>
          <Alarm onClick={() => openModal("alarm")} />
          <SelectRadio />
          <AlbaAdd onClick={() => openModal("albaAdd")} />
        </div>
      </div>
      {/* 모달 조건부 렌더링 */}
      {activeModal === "alarm" && <AlarmModal onClose={closeModal} />}
      {activeModal === "albaAdd" && <AlbaAddModal onClose={closeModal} />}
      {activeModal === "request" && <RequestModal onClose={closeModal} />}
    </div>
  );
};

export default EmployeeMainPage;
