import { Dayjs } from "dayjs";
import Button from "./Button";
import styles from "./Choice.module.css";

interface ChoiceProps {
    currentDate: Dayjs;
}

const Choice: React.FC<ChoiceProps> = ({ currentDate }) => {
    return (
        <div className={styles.choice}>
            <div className={styles.date}>
                {currentDate.format("YYYY년 MM월 DD일")}
            </div>
            <Button children={"근무 등록하기"} />
        </div>
    );
};

export default Choice;
