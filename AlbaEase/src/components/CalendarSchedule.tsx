import styles from "./CalendarSchedule.module.css";

type Schedule = {
    startTime: string;
    endTime: string;
    names: string[];
};

// props로 schedules 배열을 받음
const CalendarSchedule = ({ schedules }: { schedules: Schedule[] }) => {
    return (
        <div className={styles.calendarSchedule}>
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
