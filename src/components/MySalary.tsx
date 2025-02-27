import Calendar from "./Calendar";
import styles from "./MySalary.module.css";
import { useState } from "react";
import MypageCalendar from "./MypageCalendar";

const MySalary = () => {
  const [money, setMoney] = useState<string>("160,480");
  return (
    <div className={styles.MySalary}>
      <div className={styles.contents1}>
        <div className={styles.alba}>근무/급여 확인 - 김가윤</div>
        <div className={styles.money}>{money}</div>
      </div>
      <div className={styles.contents2}>
        <div className={styles.calendar}>
          <MypageCalendar />
        </div>
        <div className={styles.albaRadio}></div>
      </div>
    </div>
  );
};
export default MySalary;
