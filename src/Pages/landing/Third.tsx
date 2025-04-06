import styles from "./Third.module.css";
import page3 from "../../assets/landing/page3.mp4";
const Third = () => {
  return (
    <div className={styles.thirdLanding}>
      <div className={styles.content}>
        <div className={styles.contents}>
          <p className={styles.p1}>
            🔁간편한 변경 요청 - 몇 번의 클릭으로 근무 변경 신청
          </p>
          <div className={styles.p2}>
            복잡한 절차 없이 원하는 날짜와 시간으로 간편하게 요청하세요!
          </div>
        </div>
        <div className={styles.video}>
          <video autoPlay muted loop controls style={{ width: "100%" }}>
            <source src={page3} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default Third;
