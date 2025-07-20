import { Link } from "react-router-dom";
import styles from "../../../components/employeeMy/EmployeeNavBar.module.css";

const EmployeeNavBar = () => {
  return (
    <div className={styles.employeeNavBar}>
      <nav className={styles.container}>
        <Link to="/ownermypage" className={styles.nav}>
          나의 정보
        </Link>
        <Link to="/ownermysalary" className={styles.nav}>
          근무/급여 확인
        </Link>
        <Link to="/ownermychange" className={styles.nav}>
          근무 변경 내용
        </Link>
      </nav>
    </div>
  );
};

export default EmployeeNavBar;
