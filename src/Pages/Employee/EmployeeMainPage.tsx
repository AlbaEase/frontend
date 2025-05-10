import { useModal } from "../../contexts/ModalContext";
import Alarm from "../../components/Alarm";
import AlbaAdd from "../../components/AlbaAdd";
import CalendarEmployee from "../../components/CalendarEmployee";
import Choice from "../../components/Choice";
import PartTimeEmployee from "../../components/PartTimeEmployee";
import SelectRadio from "../../components/SelectRadio";
import AlbaAddModal from "../../components/Modal/AlbaAddModal";
import AlarmModal from "../../components/Modal/AlarmModal";
import RequestModalEmployee from "../../components/Modal/RequestModalEmployee";
import styles from "./EmployeeMainPage.module.css";
import MyHeader from "../../components/employeeMy/MyHeader";
import { getUserFromToken } from "../../utils/getUserFromToken";

const EmployeeMainPage = () => {
  /* 모달창 컨텍스트 생성 */
  const { activeModal, openModal, closeModal } = useModal();

  const user = getUserFromToken();
  if (!user) {
    alert("로그인 후 이용해주세요.");
    // 로그인 페이지로 리다이렉트할 수 있도록 수정!
  }

  return (
    <div className={styles.background}>
      <div className={styles.ownerMainPage}>
        <MyHeader />
        <div className={styles.mainContents}>
          <PartTimeEmployee />
          <CalendarEmployee />
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
      {activeModal === "request" && <RequestModalEmployee onClose={closeModal} />}
    </div>
  );
};

export default EmployeeMainPage;
