import styles from "./PartTime.module.css";
import Checkbox from "./Checkbox";

const PartTime = () => {
    /* DB랑 연결 후, SelectRadio 값 따라 가져오게!
     * OwnerMainPage에서 공유하는 props로 사용 예정 */
    const code: string = "B9SK73";

    return (
        <div className={styles.parttime}>
            <div className={styles.title}>알바생</div>
            <div className={styles.checkbox}>
                <Checkbox />
            </div>
            <div className={styles.code}>{`매장 코드: ${code}`}</div>
        </div>
    );
};

export default PartTime;
