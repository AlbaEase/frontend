import styles from "./PartTime.module.css";
import Checkbox from "./Checkbox";

const PartTime = () => {
    return (
        <div className={styles.parttime}>
            <div className={styles.title}>알바생</div>
            <Checkbox />
        </div>
    );
};

export default PartTime;
