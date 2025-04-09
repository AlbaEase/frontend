import { useState } from "react";
import styles from "./Alarm.module.css";
import bell from "../assets/bell.svg";

// 부모로부터 Props를 전달받아서 사용하는 곳이다.
interface AlbaAddProps {
    onClick: () => void;
}

const Alarm: React.FC<AlbaAddProps> = ({ onClick }) => {
    /* DB랑 연결해서 알람 확인했는지 따라
     * existAlarm 값을 변경하도록 해야 함 */
    const [existAlarm, setExistAlarm] = useState(true);

    const handleClick = () => {
      setExistAlarm(false);
      onClick();
    };

    return (
        <div className={styles.alarm} onClick={handleClick}>
            <div className={`${existAlarm ? styles.existAlarm : " "}`} />
            <img src={bell} alt="bell" className={styles.bellImg} />
        </div>
    );
};

export default Alarm;
