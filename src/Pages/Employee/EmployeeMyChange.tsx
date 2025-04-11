import styles from "./EmployeeMyChange.module.css";
import MyHeader from "../../components/employeeMy/MyHeader";
import EmployeeNavBar from "../../components/employeeMy/EmployeeNavBar";
import EmployeeMyCh from "../../components/employeeMy/EmployeeMyCh";

const EmployeeMyChange = () => {
  return (
    <div className={styles.employeeMychange}>
      <div className={styles.contents}>
        {/* 헤더 */}
        <MyHeader />
        <div className={styles.title}>My Page</div>
        <div className={styles.components}>
          <EmployeeNavBar />
          <EmployeeMyCh />
        </div>
      </div>
    </div>
  );
};

export default EmployeeMyChange;
