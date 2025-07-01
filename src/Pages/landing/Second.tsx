import styles from "./Second.module.css";
import albaAddVedio from "../../assets/landing/albaAddVedio.mp4";

const Second = () => {
  return (
    <>
      <div className={styles.secondLanding}>
        <div className={styles.content}>
          <div className={styles.contents}>
            <div>
              <div>사업자 번호를 통한 간편한 매장 등록</div>
              <p className={styles.p}>근무지 등록 🏠</p>
              <div>매장의 사업자번호, 매장명을 입력하면 매장 등록 완료!</div>
              <div>발급된 매장 코드를 근무자에게 알려주세요.</div>
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
