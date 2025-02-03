import styles from "./Calendar.module.css";
import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

interface CalendarProps {
    currentDate: Dayjs;
    setCurrentDate: Dispatch<SetStateAction<Dayjs>>;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, setCurrentDate }) => {
    const [daysArray, setDaysArray] = useState<(number | null)[]>([]); // daysArray 상태 관리

    const minDate = dayjs("2025-01-01");

    /* 이전 달로 이동하는 메서드 */
    const prevMonth = () => {
        /* 이전 상태 값을 가져와서 변경시키도록 함 */
        if (currentDate.isAfter(minDate, "month")) {
            // 25년 1월까지만 이동할 수 있게 함
            setCurrentDate((prevDate) => prevDate.subtract(1, "month"));
        }
    };

    /* 이후 달로 이동하는 메서드 */
    const nextMonth = () => {
        setCurrentDate((prevDate) => prevDate.add(1, "month"));
    };

    useEffect(() => {
        const startOfMonth = currentDate.startOf("month");
        /* 첫 번째 날의 요일을 숫자로 변환 (일 = 0, 월 = 1, 화 = 2, 수 = 3, ...) */
        const startDay = startOfMonth.get("day");

        const endOfMonth = currentDate.endOf("month");
        /* 마지막 날짜의 일을 가져옴 */
        const lastDay: number = endOfMonth.get("date");

        /* 캘린더의 일을 담을 배열 */
        const newDaysArray = [];
        for (let i: number = 0; i < startDay; i++) {
            newDaysArray.push(null);
        }
        for (let day = 1; day <= lastDay; day++) {
            newDaysArray.push(day);
        }
        while (newDaysArray.length < 35) newDaysArray.push(null);
        while (newDaysArray.length > 35 && newDaysArray.length < 42)
            newDaysArray.push(null);

        setDaysArray(newDaysArray);
        console.log(daysArray);
    }, [currentDate]);

    /* console 출력용 */
    console.log("currentDate is " + currentDate.format());
    const isScrollable = daysArray.length > 35;

    return (
        <div className={styles.calendar}>
            {/* 월 바꾸기 */}
            <div className={styles.header}>
                <button
                    onClick={prevMonth}
                    className={
                        currentDate.isAfter(minDate, "month")
                            ? ""
                            : styles.disabled
                    }
                    disabled={!currentDate.isAfter(minDate, "month")}>
                    {"<"}
                </button>
                <p>{currentDate.format("YYYY년 M월")}</p>
                <button onClick={nextMonth}>{">"}</button>
            </div>

            {/* 요일 */}
            <div className={styles.weekdays}>
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className={styles.weekday}>
                        {day}
                    </div>
                ))}
            </div>

            {/* 날짜 */}
            <div
                className={`${styles.days} ${
                    isScrollable ? styles.scroll : " "
                }`}>
                {daysArray.map((day, index) => (
                    <div
                        key={index}
                        className={`${day ? styles.day : styles.empty} ${
                            /* day가 null이 아니고 현재 선택한 날짜라면 */
                            day && currentDate.date() === day
                                ? styles.isSelected
                                : ""
                        }`}
                        onClick={() => {
                            if (day) {
                                setCurrentDate((prevDate) =>
                                    prevDate.date(day)
                                ); // 새로운 dayjs 객체 반환 후 설정
                            }
                        }} // day가 있으면 날짜, 없으면 빈 칸
                    >
                        {day ? day : ""}{" "}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
