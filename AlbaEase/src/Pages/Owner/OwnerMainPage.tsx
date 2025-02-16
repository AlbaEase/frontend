import { useState } from "react";
import Alarm from "../../components/Alarm";
import AlbaAdd from "../../components/AlbaAdd";
import Calendar from "../../components/Calendar";
import Choice from "../../components/Choice";
import Header from "../../components/Header";
import PartTime from "../../components/PartTime";
import SelectRadio from "../../components/SelectRadio";

import styles from "./OwnerMainPage.module.css";
import AlbaAddModal from "../../components/Modal/AlbaAddModal";
import AlarmModal from "../../components/Modal/AlarmModal";
import RequestModal from "../../components/Modal/RequestModal";

const OwnerMainPage = () => {
  // 알람모달창이 열려있는지 닫혀 있는 지 상태 정의
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState<boolean>(false);
  // onClick를 통해 false -> true 변경과 동시에 모달창 나타남
  // onClick를 사용하기 위해서 Alarm(자식) 컴포넌트에 Props를 전달해주어야한다.
  // onClose를 통해 모달창을 닫을 수 있도록  AlarmModal(자식) 컴포넌트에 onClose를 Props를 전달한다.
  const openAlarmModal = () => {
    setIsAlarmModalOpen(true);
  };
  // 알바 근무지 추가 모달창
  const [isAlbaAddModalOpen, setIsAlbaAddModalOpen] = useState<boolean>(false);
  const openAlbaAddModal = () => {
    setIsAlbaAddModalOpen(true);
  };

  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const openRequestModal = () => {
    setIsRequestModalOpen(true);
  };

  return (
    <div className={styles.background}>
      <div className={styles.ownerMainPage}>
        <Header />
        <div className={styles.mainContents}>
          <PartTime />
          <Calendar openRequestModal={openRequestModal} />
          <Choice />
        </div>
        <div className={styles.bottomContents}>
          <Alarm onClick={openAlarmModal} />
          <SelectRadio />
          <AlbaAdd onClick={openAlbaAddModal} />
        </div>
      </div>
      {/* 모달 조건부 렌더링 */}
      {/* 모달이 ture -> 화면에 랜더링, false -> 랜더링 되지 않는다. */}
      {/* onClick으로 true -> 모달창 랜더링 */}
      {/* onClose로 false -> 모달창 랜더링 하지 않음*/}
      {isAlarmModalOpen && (
        <AlarmModal onClose={() => setIsAlarmModalOpen(false)} />
      )}
      {isAlbaAddModalOpen && (
        <AlbaAddModal onClose={() => setIsAlbaAddModalOpen(false)} />
      )}
      {/* RequestModal 조건부 렌더링 */}
      {isRequestModalOpen && (
        <RequestModal onClose={() => setIsRequestModalOpen(false)} />
      )}
    </div>
  );
};

export default OwnerMainPage;
