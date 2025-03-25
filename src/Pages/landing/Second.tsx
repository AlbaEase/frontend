import styles from "./Second.module.css";
import albaAddVedio from "../../assets/landing/albaAddVedio.mp4";

const Second = () => {
  return (
    <>
      <div className={styles.secondLanding}>
        <div className={styles.content}>
          <div className={styles.contents}>
            <div>
              <p className={styles.p}>근무지 등록 🏠</p>
              <div>사업자 번호를 통한 간편한 매장 등록</div>
            </div>
          </div>
          <div className={styles.video}>
            <video autoPlay muted loop controls style={{ width: "100%" }}>
              <source src={albaAddVedio} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </>
  );
};
export default Second;
