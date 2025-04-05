import { useState } from "react";
import styles from "./EmployeeMyS.module.css";
import EmployeeMyCalendar from "./EmployeeMyCalendar";

const EmployeeMyS = () => {
  const [salary, setSalary] = useState<string>("561,680");

  return (
    <div className={styles.employeeMyS}>
      <div className={styles.header}>
        <div className={styles.select}>
          <select>
            <option value="전체">전체</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
        <div className={styles.title}>나의 근무/급여</div>
        <div className={styles.salary}>{salary}</div>
      </div>
      <div className={styles.content}>
        <EmployeeMyCalendar />
        <div className={styles.inputBox}>
          <div>
            <input type="checkbox" />
            주휴수당 포함
          </div>
          <div>
            <input type="checkbox" />
            세금 적용(소득세|3.3%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMyS;
