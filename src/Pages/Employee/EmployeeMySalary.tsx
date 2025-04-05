import styles from "./EmployeeMyChange.module.css";
import MyHeader from "../../components/employeeMy/MyHeader";
import EmployeeNavBar from "../../components/employeeMy/EmployeeNavBar";
import EmployeeMyS from "../../components/employeeMy/EmployeeMyS";

const EmployeeMySalary = () => {
  return (
    <div className={styles.employeeMychange}>
      <div className={styles.contents}>
        {/* 헤더 */}
        <MyHeader />
        <div className={styles.title}>My Page</div>
        <div className={styles.components}>
          <EmployeeNavBar />
          <EmployeeMyS />
        </div>
      </div>
    </div>
  );
};

export default EmployeeMySalary;
