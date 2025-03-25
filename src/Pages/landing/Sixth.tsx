import styles from "./Sixth.module.css";
import page61 from "../../assets/landing/page6-1.png";
import page62 from "../../assets/landing/page6-2.png";

const Sixth = () => {
  return (
    <div className={styles.sixthLanding}>
      <div className={styles.content}>
        <div className={styles.contents}>
          <p className={styles.p1}>
            ✅급여 정보 - 사장님과 알바생이 동일한 급여 정보 확인
          </p>
          <div className={styles.p2}>
            급여 계산을 편하게, 급여 확인을 손쉽게!
          </div>
        </div>
        <div className={styles.imgs}>
          <div className={styles.img1}>
            <img
              src={page61}
              className={styles.img11}
              //   style={{ width: "100%", height: "90%" }}
            />
          </div>
          <div className={styles.img1}>
            <img
              src={page62}
              className={styles.img11}
              //   style={{ width: "100%", height: "90%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sixth;
