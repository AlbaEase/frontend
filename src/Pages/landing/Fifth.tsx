import styles from "./Fifth.module.css";
import page5 from "../../assets/landing/page5.png";

const Fourth = () => {
  return (
    <div className={styles.fifthLanding}>
      <div className={styles.content}>
        <div className={styles.contents}>
          <p className={styles.p1}>
            📢실시간 알림및 승인 - 승인 결과 즉시 확인
          </p>
          <div className={styles.p2}>
            근무 변경 요청 여부를 승인하면 자동으로 인정에 반영됩니다.
          </div>
        </div>
        <div className={styles.img}>
          <img src={page5} style={{ width: "90%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default Fourth;
