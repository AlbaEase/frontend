import dayjs, { Dayjs } from "dayjs";

// 스케줄 데이터 타입 정의
export interface EmployeeSchedule {
    userId: number;
    fullName: string;
    startTime: string;
    endTime: string;
    repeatDays: string;
    workDates: Dayjs;
}

// 그룹화된 결과 타입
export interface GroupedSchedule {
    date: string;
    groups: {
        startTime: string;
        endTime: string;
        users: {
            userId: number;
            name: string;
        }[];
    }[];
}

// 스케줄 그룹화 함수
export const getGroupedSchedules = (
    schedules: EmployeeSchedule[],
    selectedNames: string[],
    referenceDate: Dayjs
): GroupedSchedule[] => {
    const filtered = schedules.filter((schedule) =>
        selectedNames.includes(schedule.fullName)
    );

    const startOfMonth = referenceDate.startOf("month");
    const endOfMonth = referenceDate.endOf("month");

    const monthDates: Dayjs[] = [];
    let current = startOfMonth;

    while (
        current.isBefore(endOfMonth, "day") ||
        current.isSame(endOfMonth, "day")
    ) {
        monthDates.push(current);
        current = current.add(1, "day");
    }

    const dateMap = monthDates.reduce((acc, date) => {
        acc[date.format("YYYY-MM-DD")] = [];
        return acc;
    }, {} as Record<string, { startTime: string; endTime: string; users: { userId: number; name: string }[] }[]>);

    filtered.forEach((schedule) => {
        const { repeatDays, workDates, startTime, endTime, fullName, userId } =
            schedule;
        const userObj = { userId, name: fullName };

        // 중복 userId도 체크
        const insertOrAppend = (dateStr: string) => {
            const existing = dateMap[dateStr]?.find(
                (g) => g.startTime === startTime && g.endTime === endTime
            );
            if (existing) {
                const isAlreadyIncluded = existing.users.some(
                    (user) => user.userId === userObj.userId
                );
                if (!isAlreadyIncluded) {
                    existing.users.push(userObj);
                }
            } else {
                dateMap[dateStr]?.push({
                    startTime,
                    endTime,
                    users: [userObj],
                });
            }
        };

        if (!repeatDays) {
            const dateStr = workDates.format("YYYY-MM-DD");
            if (dayjs(workDates).month() === referenceDate.month()) {
                insertOrAppend(dateStr);
            }
        } else {
            const repeatArray = repeatDays.split(",");
            const dayOfWeekStrings = [
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT",
            ];

            monthDates.forEach((date) => {
                const dayStr = dayOfWeekStrings[date.day()];
                if (repeatArray.includes(dayStr)) {
                    const dateStr = date.format("YYYY-MM-DD");
                    insertOrAppend(dateStr);
                }
            });
        }
    });

    return Object.entries(dateMap).map(([date, groups]) => ({
        date,
        groups: groups
            .map((group) => ({
                ...group,
                users: group.users.sort((a, b) => a.name.localeCompare(b.name)), // 오름차순 정렬
            }))
            .sort((a, b) => a.startTime.localeCompare(b.startTime)), // 기존 시간 기준 정렬 유지
    }));
};
