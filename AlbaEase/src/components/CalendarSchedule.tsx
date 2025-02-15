import styles from "./CalendarSchedule.module.css";

interface CalendarScheduleProps {
  startTime: string;
  endTime: string;
  employeeName: string;
  openRequestModal: () => void; // 모달 열기 함수
}

const CalendarSchedule = ({
  startTime,
  endTime,
  employeeName,
  openRequestModal,
}: CalendarScheduleProps) => {
  return (
    <div className={styles.calendarSchedule} onClick={openRequestModal}>
      <div className={styles.workHours}>{`${startTime} ~ ${endTime}`}</div>
      <div className={styles.names}>{employeeName}</div>
    </div>
  );
};

export default CalendarSchedule;
