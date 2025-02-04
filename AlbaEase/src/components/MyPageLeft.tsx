import styles from "./MyPageLeft.module.css";
import { Link } from "react-router-dom";

const MyPageLeft = () => {
  return (
    <div className={styles.MyPageLeft}>
      <nav className={styles.container}>
        <div className={styles.nav}>
          <Link to="" className={styles.link}>
            나의 정보
          </Link>
        </div>
        <div className={styles.nav}>
          <Link to="/ownermysalary" className={styles.link}>
            근무/급여 확인
          </Link>
        </div>
        <div className={styles.nav}>
          <Link to="/ownermychange" className={styles.link}>
            근무 변경 내용
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MyPageLeft;
