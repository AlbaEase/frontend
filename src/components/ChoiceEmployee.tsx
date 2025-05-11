import { useEmployeeSchedule } from "../contexts/EmployeeScheduleContext";
import ChoiceScheduleEmployee from "./ChoiceScheduleEmployee";
import Button from "./Button";
import styles from "./Choice.module.css";

const Choice = () => {
    const { currentDate, viewedSchedules } = useEmployeeSchedule();

    // 선택된 날짜를 YYYY-MM-DD 형식으로 변환
    const dateStr = currentDate.format("YYYY-MM-DD");

    // groupedSchedules에서 선택된 날짜의 데이터를 찾기
    const schedulesForDate = viewedSchedules
        .filter((schedule) => schedule.date === dateStr)  // 해당 날짜를 찾음
        .flatMap((schedule) =>
            schedule.groups.map((group) => ({
                startTime: group.startTime.split(":").slice(0, 2).join(":"), // "HH:mm:ss" -> "HH:mm"
                endTime: group.endTime.split(":").slice(0, 2).join(":"),
                names: group.names,
            }))
        );
    return (
        <div className={styles.choice}>
            <div className={styles.date}>
                {currentDate.format("YYYY년 MM월 DD일")}
            </div>
            <div className={styles.scheduleContainer}>
                {schedulesForDate.length > 0 && (
                    <ChoiceScheduleEmployee schedules={schedulesForDate} />
                )}
            </div>
            <Button children={"근무 등록하기"} />
        </div>
    );
};

export default Choice;
