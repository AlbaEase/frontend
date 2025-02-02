import styles from "./Calendar.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

const Calendar = () => {
    /* 기본적인 달력 뼈대를 만들예정, 25년 1월~12월 */
    const [currentDate, setCurrentDate] = useState(dayjs()); // 현재 날짜 받아오기
    // useState 에러는 어떻게게 할지 몰라서 그냥 둠...

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

    const startOfMonth = currentDate.startOf("month");
    /* 첫 번째 날의 요일을 숫자로 변환 (일 = 0, 월 = 1, 화 = 2, 수 = 3, ...) */
    const startDay = startOfMonth.get("day");

    const endOfMonth = currentDate.endOf("month");
    /* 마지막 날짜의 일을 가져옴 */
    const lastDay: number = endOfMonth.get("date");

    /* 캘린더의 일을 담을 배열 */
    const daysArray = [];
    for (let i: number = 0; i < startDay; i++) {
        daysArray.push(null);
    }
    for (let day = 1; day <= lastDay; day++) {
        daysArray.push(day);
    }
    if (daysArray.length < 35) {
        for (let i: number = daysArray.length; i < 35; i++) {
            daysArray.push(null);
        }
    }

    console.log(daysArray);

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
            <div className={styles.days}>
                {daysArray.map((day, index) => (
                    <div
                        key={index}
                        className={day ? styles.day : styles.empty} // day가 있으면 날짜, 없으면 빈 칸
                    >
                        {day ? day : ""}{" "}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
