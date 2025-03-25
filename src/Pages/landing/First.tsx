import styles from "./First.module.css";
import logo from "../../assets/landing/logo.svg";

const First = () => {
  return (
    <>
      <div className={styles.firstLanding}>
        <div className={styles.contentBox}>
          <div className={styles.logo}>
            <img src={logo} alt="로고" style={{ width: "80%" }} />
          </div>
          <div className={styles.contents}>
            <p className={styles.p1}>
              📅스마트한 근무 관리, 한눈에 확인하세요!
            </p>
            <div>근무 일정 변경부터 승인까지, 한곳에서 간편하게!</div>
            <div>
              손쉽게 스케줄을 조정하고, 실시간으로 관리하는 스마트 근무 캘린더
              서비스🚀
            </div>
            <p>AlbaEase를 소개합니다👋👋</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default First;
