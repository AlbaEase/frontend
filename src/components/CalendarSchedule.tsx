import styles from "./CalendarSchedule.module.css";

interface CalendarScheduleProps {
    schedules: Schedule[];
    openRequestModal: () => void; // 모달 열기 함수
}

type Schedule = {
    startTime: string;
    endTime: string;
    names: string[];
};

// props로 schedules 배열을 받음
const CalendarSchedule: React.FC<CalendarScheduleProps> = ({
    schedules,
    openRequestModal,
}) => {
    return (
        <div className={styles.calendarSchedule} onClick={openRequestModal}>
            {schedules.length > 0 ? (
                schedules.map((group, index) => {
                    // "HH:mm:ss"에서 시와 분만 추출
                    const startTimeFormatted = group.startTime
                        .split(":")
                        .slice(0, 2)
                        .join(":");
                    const endTimeFormatted = group.endTime
                        .split(":")
                        .slice(0, 2)
                        .join(":");

                    return (
                        <div key={index} className={styles.scheduleItem}>
                            <div className={styles.workHours}>
                                {`${startTimeFormatted} ~ ${endTimeFormatted}`}
                            </div>
                            <div className={styles.names}>
                                {group.names.join(", ")}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className={styles.noSchedule}>일정이 없습니다.</div>
            )}
        </div>
    );
};

export default CalendarSchedule;
