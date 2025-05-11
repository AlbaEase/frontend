import styles from "./ChoiceSchedule.module.css";

type Schedule = {
    startTime: string;
    endTime: string;
    names: string[];
};

interface ChoiceScheduleProps {
    schedules: Schedule[];
}

const ChoiceSchedule = ({ schedules }: ChoiceScheduleProps) => {
    return (
        <div className={styles.box}>
            {schedules.map((schedule, index) => (
                <div className={styles.choiceSchedule}>
                    <div key={index} className={styles.scheduleBlock}>
                        <div className={styles.workhours}>
                            {`${schedule.startTime} - ${schedule.endTime}`}
                        </div>
                        <ul className={styles.names}>
                            {schedule.names.map((name, i) => (
                                <li key={i} className={styles.employeeName}>
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChoiceSchedule;
