import styles from "./LandingHeader.module.css";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <>
      <div className={styles.landingHeader}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <img src={logo} alt="로고" className={styles.img} />
            <div>AlbaEase</div>
          </div>
          <div className={styles.contents}>
            <Link to="login" className={styles.title}>
              알바이즈 시작하기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHeader;
