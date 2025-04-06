import styles from "./Fourth.module.css";
import page41 from "../../assets/landing/page4-1.png";
import page42 from "../../assets/landing/page4-2.png";

const Fourth = () => {
  return (
    <div className={styles.fourthLanding}>
      <div className={styles.content}>
        <div className={styles.contents}>
          <p className={styles.p1}>
            🔁간편한 변경 요청 - 몇 번의 클릭으로 근무 변경 신청
          </p>
          <div className={styles.p2}>
            복잡한 절차 없이 원하는 날짜와 시간으로 간편하게 요청하세요!
          </div>
        </div>
        <div className={styles.imgs}>
          <div className={styles.img1}>
            <img
              src={page41}
              className={styles.img11}
              //   style={{ width: "100%", height: "90%" }}
            />
          </div>
          <div className={styles.img1}>
            <img
              src={page42}
              className={styles.img11}
              //   style={{ width: "100%", height: "90%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fourth;
