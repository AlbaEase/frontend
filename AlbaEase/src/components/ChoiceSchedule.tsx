import styles from "./ChoiceSchedule.module.css";

const ChoiceSchedule = () => {
    /* 얘네를 하나의 객체에 넣고 빼서 쓸 수 있게 하면 좋을 듯??
     * 나중에 DB에서 가져와서 할당해야 함 */
    const startTime: string = "13:00";
    const endTime: string = "18:00";
    const employeeNames: string[] = ["이름1", "이름2", "이름3"];

    return (
        <div className={styles.choiceSchedule}>
            <div
                className={styles.workhours}>{`${startTime} - ${endTime}`}</div>
            <ul className={styles.names}>
                {employeeNames.map((employeeName, index) => (
                    <li key={index} className={styles.employeeName}>
                        {employeeName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChoiceSchedule;

/*
            <div className={styles.names}>
                {employeeNames.map((employeeName, index) => (
                    <div key={index} className={styles.employeeName}>
                        {employeeName}
                    </div>
                ))}
            </div>
*/