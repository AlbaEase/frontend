import styles from "./CalendarSchedule.module.css";
import { useModal } from "../contexts/ModalContext";
import { getUserFromToken } from "../utils/getUserFromToken";

interface CalendarScheduleProps {
    schedules: Schedule[];
}

type Schedule = {
    scheduleId: number;
    startTime: string;
    endTime: string;
    names: string[];
};

// props로 schedules 배열을 받음
const CalendarSchedule: React.FC<CalendarScheduleProps> = ({ schedules }) => {
    const { openModal } = useModal(); // useModal 훅 사용
    // console.log("스케줄", schedules);

    // 추후 수정
    const handleOpenModal = () => {
        // 토큰 확인
        const user = getUserFromToken();
        if (user) {
            const fullName = user.fullName;
            const role = user?.role;

            console.log(role);

            if (role === "WORKER") {
                // 모든 schedule에 대해 이름 포함 여부 확인
                if (
                    fullName &&
                    schedules.some((schedule) =>
                        schedule.names.includes(fullName)
                    )
                ) {
                    console.log("넘기는 schedules:", schedules);
                    openModal("request", schedules);
                } else {
                    alert("본인의 근무만 요청할 수 있습니다.");
                    return;
                }
            } else {    // 사장님일 경우
                openModal("request", schedules);
            }
        } else {
            alert("로그인 후 이용해주세요.");
            // 로그인 페이지로 리다이렉트할 수 있도록 수정!
            return;
        }
    };

    return (
        <div
            className={styles.calendarSchedule}
            onClick={handleOpenModal} // 모달 열기
        >
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
