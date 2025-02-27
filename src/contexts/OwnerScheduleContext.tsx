import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    useEffect,
} from "react";
import dayjs, { Dayjs } from "dayjs";
import axiosInstance from "../api/loginAxios";

/* 넘길 수 있는 데이터
 * 1. 알바생의 아이디, 시작 시간과 종료 시간 (schedule 컴포넌트들에 사용)
 * 2. 선택된 알바생 목록 (checkbox와 schedule 컴포넌트들에 사용)
 * 3. 전체 스케줄 (schedule 컴포넌트들에 사용) > 2번 활용해서 필터링
 * 4. 가게 정보 (가게명, 매장 코드)
 *
 * ## 참고: 데이터 가져오는 방법 ##
 * Provider 내부에서 fetch() 이용해 하위 컴포넌트는 불러다가 쓰도록 함
 * export const OwnerScheduleProvider 부분에 예시 주석으로 작성
 */

interface OwnerSchedule {
    userId: number; // 알바생 아이디
    fullName: string; // 알바생 이름
    startTime: string; // 시작 시간 (13:00)
    endTime: string; // 종료 시간 (21:00)
    repeatDays: string; // 반복 요일
    workDates: Dayjs; // 근무 날짜
}

interface Store {
    storeId: number;
    name: string;
    storeCode: string;
}

/* 공유할 context type */
interface OwnerScheduleContextType {
    stores: Store[]; // 전체 매장 목록 -> 나중에 사용자 따라서 다른 걸 받아오도록 해야 됨!
    setStores: React.Dispatch<React.SetStateAction<Store[]>>;
    selectedStore: number;
    setSelectedStore: React.Dispatch<React.SetStateAction<number>>;
    selectedList: string[]; // 선택된 알바생 목록
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
    ownerSchedules: OwnerSchedule[]; // 선택 매장 스케줄 목록
    setOwnerSchedules: React.Dispatch<React.SetStateAction<OwnerSchedule[]>>;
    groupedSchedules: {
        date: string;
        groups: { startTime: string; endTime: string; names: string[] }[];
    }[];
    // 날짜와 같은 시간대에 일하는 알바생 그룹
    currentDate: Dayjs;
    setCurrentDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    selectedName: string;
    setSelectedName: React.Dispatch<React.SetStateAction<string>>;
    otherGroupMembers: string[];
}

const OwnerScheduleContext = createContext<
    OwnerScheduleContextType | undefined
>(undefined);

export const OwnerScheduleProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [stores, setStores] = useState<Store[]>([]); // DB에서 가져올 가게 목록
    const [selectedStore, setSelectedStore] = useState<number>(0);
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const [ownerSchedules, setOwnerSchedules] = useState<OwnerSchedule[]>([]);
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [selectedName, setSelectedName] = useState(""); // 교환을 요청할 근무자 (기존 근무자)

    // localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem("accessToken");

    // DB에서 가게 목록 가져오기 (axios로 변경)
    useEffect(() => {
        const fetchStores = async () => {
            try {
                if (token) {
                    // axios 요청 헤더에 토큰을 추가합니다.
                    const res = await axiosInstance.get(
                        "http://3.39.237.218:8080/store/me",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Authorization 헤더에 Bearer 토큰 추가
                            },
                        }
                    );
                    const data = res.data;

                    console.log("받아온 데이터: ", data);

                    if (!data) {
                        console.error("가게 목록 데이터가 없습니다.");
                        return;
                    }

                    const filteredStores = data.map((store: any) => ({
                        storeId: store.storeId,
                        name: store.name,
                        storeCode: store.storeCode,
                    }));

                    setStores(filteredStores);
                    if (filteredStores.length > 0) {
                        setSelectedStore(filteredStores[0].storeId);
                    }
                } else {
                    console.error("토큰이 없습니다. 인증을 확인하세요.");
                    // 인증 절차를 여기에 추가할 수 있습니다.
                }
            } catch (error) {
                console.error("가게 목록을 불러오는 데 실패했습니다.", error);
            }
        };

        fetchStores();
    }, []);

    // 가게 선택할 때마다 스케줄 다르게 불러오기 (axios로 변경)
    useEffect(() => {
        const fetchSchedules = async () => {
            if (!selectedStore) return;

            try {
                if (token) {
                    const res = await axiosInstance.get(
                        `http://3.39.237.218:8080/schedule/store/${selectedStore}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Authorization 헤더에 Bearer 토큰 추가
                            },
                        }
                    );
                    const data: OwnerSchedule[] = res.data;
                    setOwnerSchedules(data);
                } else {
                    console.error("토큰이 없습니다. 인증을 확인하세요.");
                }
            } catch (error) {
                console.error(
                    "스케줄 데이터를 불러오는 데 실패했습니다.",
                    error
                );
            }
        };

        fetchSchedules();
    }, [selectedStore]);

    useEffect(() => {
        console.log("현재 ownerSchedules 데이터: ", ownerSchedules);
    }, [ownerSchedules]);

    /* 스케줄 그룹화 */
    const groupedSchedules = useMemo(() => {
        /* selectedList에 있는 알바생들의 일정만 filteredSchedules에 저장 */
        const filteredSchedules = ownerSchedules.filter((schedule) =>
            selectedList.includes(schedule.fullName)
        );

        console.log("스케줄", ownerSchedules);
        console.log("선택 리스트", selectedList);
        console.log("필터링 된 스케줄", filteredSchedules);

        /* currentDate를 기준으로 한 달의 시작일과 종료일을 계산 */
        const startOfMonth = currentDate.startOf("month");
        const endOfMonth = currentDate.endOf("month");

        /* 각 일자별 배열 */
        const monthDates: Dayjs[] = [];
        let currentDateInMonth = startOfMonth;

        /* 해당 월의 시작부터 끝까지 배열에 저장 */
        while (
            currentDateInMonth.isBefore(endOfMonth, "day") ||
            currentDateInMonth.isSame(endOfMonth, "day")
        ) {
            monthDates.push(currentDateInMonth);
            currentDateInMonth = currentDateInMonth.add(1, "day");
        }

        /* 날짜별 스케줄을 저장하는 객체
         * 날짜를 키로 하고 각 날짜에 시작, 종료, 알바생 명단을 저장 */
        const scheduleMap = monthDates.reduce((acc, date) => {
            acc[date.format("YYYY-MM-DD")] = []; // 날짜별 빈 배열로 초기화
            return acc;
            // 형식은 날짜(string), 일정 기록하는 객체(시작 시간, 끝 시간, 알바생 명단)
        }, {} as Record<string, { startTime: string; endTime: string; names: string[] }[]>);

        filteredSchedules.forEach((schedule) => {
            // repeat_days가 null인 경우, workDate를 기준으로 날짜 매칭
            if (!schedule.repeatDays) {
                const workDate = dayjs(schedule.workDates); // workDate를 Dayjs로 변환
                if (workDate.month() === currentDate.month()) {
                    // 스케줄의 월이 현재 날짜의 월과 같으면
                    const dateStr = workDate.format("YYYY-MM-DD"); // 해당 날짜에 스케줄 추가
                    const existingGroup = scheduleMap[dateStr].find(
                        // 동일한 스케줄 있는지 찾음
                        (group) =>
                            group.startTime === schedule.startTime &&
                            group.endTime === schedule.endTime
                    );

                    if (existingGroup) {
                        // 이미 존재하는 그룹 있으면 이름을 추가
                        existingGroup.names.push(schedule.fullName);
                    } else {
                        // 이전에 해당 스케줄 그룹이 없으면 새로 그룹 추가
                        scheduleMap[dateStr].push({
                            startTime: schedule.startTime,
                            endTime: schedule.endTime,
                            names: [schedule.fullName],
                        });
                    }
                }
            }

            // repeat_days가 null이 아닌 경우, 요일을 기준으로 반복되는 스케줄 계산
            /* 시작 날짜 가져와서 그날부터 추가하도록 수정해야 됨 */
            else {
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
                    const dayOfWeek = dayOfWeekStrings[date.day()]; // 해당 날짜의 요일, 2025-02-13의 경우 "목"

                    // 반복 요일 배열에 해당 날짜의 요일이 포함되어 있으면 스케줄 추가
                    if (schedule.repeatDays.includes(dayOfWeek)) {
                        const dateStr = date.format("YYYY-MM-DD");

                        // scheduleMap[dateStr]가 존재하지 않으면 빈 배열로 초기화
                        if (!scheduleMap[dateStr]) {
                            scheduleMap[dateStr] = [];
                        }

                        // 해당 날짜에 이미 같은 시간대의 스케줄이 있다면, 알바생 이름 추가
                        const existingGroup = scheduleMap[dateStr].find(
                            (group) =>
                                group.startTime === schedule.startTime &&
                                group.endTime === schedule.endTime
                        );

                        if (existingGroup) {
                            existingGroup.names.push(schedule.fullName);
                        } else {
                            scheduleMap[dateStr].push({
                                startTime: schedule.startTime,
                                endTime: schedule.endTime,
                                names: [schedule.fullName],
                            });
                        }
                    }
                });
            }
        });

        // 날짜별로 그룹화된 스케줄을 배열로 변환
        const result = Object.entries(scheduleMap).map(([dateStr, groups]) => ({
            date: dateStr,
            groups: groups.sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            ), // startTime 기준 정렬
        }));

        // console.log("groupedSchedules 결과: ", result);
        return result;
    }, [selectedList, ownerSchedules, currentDate]); // 선택된 알바생 목록이 변경되거나 데이터베이스에 변경이 있을 때만 재계산

    /* 근무하는 날짜 또는 시간이 다른 그룹의 명단 */
    const otherGroupMembers = useMemo(() => {
        // 1. 그룹화된 스케줄에서 currentDate에 해당하는 그룹 찾기
        const currentDateGroups =
            groupedSchedules.find(
                (group) => group.date === currentDate.format("YYYY-MM-DD")
            )?.groups || [];

        // 2. currentDate에 해당하는 그룹에서 선택된 알바생의 그룹 찾기
        const myGroup = currentDateGroups.find((group) =>
            group.names.includes(selectedName)
        );

        if (!myGroup) return []; // 만약 나의 그룹이 없다면 빈 배열 리턴

        // 3. 나의 그룹에 포함되지 않은 다른 사람들 필터링
        const nonOverlappingWorkers = ownerSchedules.filter((schedule) => {
            // 자기 자신 제외
            if (schedule.fullName === selectedName) return false;

            // 현재 날짜 그룹에서 선택된 알바생의 그룹에 포함되지 않은 사람들
            return currentDateGroups.every(
                (group) => !group.names.includes(schedule.fullName)
            );
        });

        return nonOverlappingWorkers.map((schedule) => schedule.fullName);
    }, [ownerSchedules, selectedName, groupedSchedules, currentDate]);

    return (
        <OwnerScheduleContext.Provider
            value={{
                stores,
                setStores,
                selectedStore,
                setSelectedStore,
                selectedList,
                setSelectedList,
                ownerSchedules,
                setOwnerSchedules,
                groupedSchedules,
                currentDate,
                setCurrentDate,
                selectedName,
                setSelectedName,
                otherGroupMembers,
            }}>
            {children}
        </OwnerScheduleContext.Provider>
    );
};

export const useOwnerSchedule = () => {
    const context = useContext(OwnerScheduleContext);
    if (!context) {
        throw new Error("Provider가 필요합니다.");
    }
    return context;
};
