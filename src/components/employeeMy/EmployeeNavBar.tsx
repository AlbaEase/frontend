import { Link } from "react-router-dom";
import styles from "./EmployeeNavBar.module.css";

const EmployeeNavBar = () => {
  return (
    <div className={styles.employeeNavBar}>
      <nav className={styles.container}>
        <Link to="/employeemypage" className={styles.nav}>
          나의 정보
        </Link>
        <Link to="/employeemypage/mysalary" className={styles.nav}>
          근무/급여 확인
        </Link>
        <Link to="/employeemypage/mychange" className={styles.nav}>
          근무 변경 내용
        </Link>
      </nav>
    </div>
  );
};

export default EmployeeNavBar;
