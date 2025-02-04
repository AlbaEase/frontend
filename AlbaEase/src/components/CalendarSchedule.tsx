import styles from "./CalendarSchedule.module.css";

interface CalendarScheduleProps {
    startTime: string;
    endTime: string;
    employeeName: string;
}

const CalendarSchedule = ({
    startTime,
    endTime,
    employeeName,
}: CalendarScheduleProps) => {
    return (
        <div className={styles.calendarSchedule}>
            <div
                className={styles.workHours}>{`${startTime} ~ ${endTime}`}</div>
            <div className={styles.names}>{employeeName}</div>
        </div>
    );
};

export default CalendarSchedule;
