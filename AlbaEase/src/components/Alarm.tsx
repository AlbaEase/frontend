import styles from "./Alarm.module.css";
import bell from "../assets/bell.svg";

const Alarm = () => {
    /* DB랑 연결해서 알람 확인했는지 따라
     * existAlarm 값을 변경하도록 해야 함 */
    const existAlarm: boolean = true;

    return (
        <div className={styles.alarm}>
            <div className={`${existAlarm ? styles.existAlarm : " "}`} />
            <img src={bell} alt="bell" className={styles.bellImg} />
        </div>
    );
};

export default Alarm;
