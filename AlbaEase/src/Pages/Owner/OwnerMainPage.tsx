import { useState } from "react";
import dayjs from "dayjs";
import Alarm from "../../components/Alarm";
import AlbaAdd from "../../components/AlbaAdd";
import Calendar from "../../components/Calendar";
import Choice from "../../components/Choice";
import Header from "../../components/Header";
import PartTime from "../../components/PartTime";
import SelectRadio from "../../components/SelectRadio";

import styles from "./OwnerMainPage.module.css";

const OwnerMainPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs()); // 현재 날짜 받아오기

  return (
    <div className={styles.background}>
      <div className={styles.ownerMainPage}>
        <Header />
        <div className={styles.mainContents}>
          <PartTime />
          <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
          <Choice currentDate={currentDate} />
        </div>
        <div className={styles.bottomContents}>
          <Alarm />
          <SelectRadio />
          <AlbaAdd />
        </div>
      </div>
    </div>
  );
};

export default OwnerMainPage;
