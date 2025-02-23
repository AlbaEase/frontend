import styles from "./LandingPage.module.css";
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <>
      <div className={styles.landingPage}>
        <div className={styles.header}>헤더</div>
        <div className={styles.main}>
          <p>
            <Link to="../login">여기를 클릭</Link>해 로그인 하세요!
          </p>
          <p>
            <Link to="../register">여기를 클릭</Link>해 회원가입 하세요!!
          </p>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
