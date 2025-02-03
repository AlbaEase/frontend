import styles from "./PartTime.module.css";
import Checkbox from "./Checkbox";

const PartTime = () => {
    return (
        <div className={styles.parttime}>
            <p>알바생</p>
            <Checkbox />
        </div>
    );
};

export default PartTime;
