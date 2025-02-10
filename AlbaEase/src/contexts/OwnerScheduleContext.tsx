import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    useEffect,
} from "react";

/* 넘길 수 있는 데이터
 * 1. 알바생의 아이디, 시작 시간과 종료 시간 (schedule 컴포넌트들에 사용)
 * 2. 선택된 알바생 목록 (checkbox와 schedule 컴포넌트들에 사용)
 * 3. 전체 스케줄 (schedule 컴포넌트들에 사용) > 2번 활용해서 필터링
 * 즉, ChoiceSchedule, CalendarSchedule, checkbox 등에서 공유할 예정!!
 *
 * ## 참고: 데이터 가져오는 방법 ##
 * Provider 내부에서 fetch() 이용해 하위 컴포넌트는 불러다가 쓰도록 함
 * export const OwnerScheduleProvider 부분에 예시 주석으로 작성
 */

/* 새 타입 명시 */
interface OwnerSchedule {
    user_id: number; // 알바생 아이디
    name: string; // 알바생 이름
    startTime: string; // 시작 시간 (13:00)
    endTime: string; // 종료 시간 (21:00)
}

interface Store {
    storeId: number;
    name: string;
    storeCode: string;
}

/* 공유할 context type */
interface OwnerScheduleContextType {
    stores: Store[];
    setStores: React.Dispatch<React.SetStateAction<Store[]>>;
    selectedStore: number;
    setSelectedStore: React.Dispatch<React.SetStateAction<number>>;
    selectedList: string[]; // 선택된 알바생 목록
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
    ownerSchedules: OwnerSchedule[]; // 전체 일정 목록
    setOwnerSchedules: React.Dispatch<React.SetStateAction<OwnerSchedule[]>>;
    groupedSchedules: { startTime: string; endTime: string; names: string[] }[]; // 같은 시간대에 일하는 알바생 그룹
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

    /* DB에서 가게 목록 가져오기 */
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch("http://localhost:8080/stores"); // API 호출
                const data: any[] | undefined = await res.json(); // data가 undefined일 수도 있음

                if (!data) {
                    console.error("가게 목록 데이터가 없습니다.");
                    return; // 함수 종료
                }

                // storeId, name, storeCode만 추출하여 새로운 배열 생성
                const filteredStores = data.map((store) => ({
                    storeId: store.storeId,
                    name: store.name,
                    storeCode: store.storeCode,
                }));

                console.log("가게 목록 (storeId만): ", filteredStores);
                console.log("가게 목록: ", filteredStores);
                setStores(filteredStores);
                if (filteredStores.length > 0) {
                    setSelectedStore(filteredStores[0].storeId); // 기본 선택값 설정
                }
            } catch (error) {
                console.error("가게 목록을 불러오는 데 실패했습니다.", error);
            }
        };

        fetchStores();
    }, []);

    /* 가게 선택할 때마다 스케줄 다르게 불러오기 */
    useEffect(() => {
        const fetchSchedules = async () => {
            // selectedStore는 storeId로 number 타입
            if (!selectedStore) return; // 선택된 가게가 없으면 실행하지 않음

            try {
                const res = await fetch(`http://localhost:8080/schedules/store/${selectedStore}`);
                const data: OwnerSchedule[] = await res.json();
                setOwnerSchedules(data);
            } catch (error) {
                console.error(
                    "스케줄 데이터를 불러오는 데 실패했습니다.",
                    error
                );
            }
        };

        console.log(selectedStore);
        fetchSchedules();
    }, [selectedStore]);

    const groupedSchedules = useMemo(() => {
        /* selectedList에 있는 알바생들의 일정만 filteredSchedules에 저장 */
        const filteredSchedules = ownerSchedules.filter((schedule) => {
            selectedList.includes(schedule.name);
        });

        /* 알바생들을 그룹화한 것을 모을 배열 생성 */
        const groupsArray: {
            startTime: string;
            endTime: string;
            names: string[];
        }[] = [];

        /* 기존에 존재하는 그룹의 시작과 종료 시간이 동일하다면 그룹에 추가
         * 그렇지 않다면 새로운 그룹을 만듦 */
        filteredSchedules.forEach((schedule) => {
            const existingGroup = groupsArray.find(
                (group) =>
                    group.startTime === schedule.startTime &&
                    group.endTime === schedule.endTime
            );

            if (existingGroup) {
                existingGroup.names.push(schedule.name);
            } else {
                groupsArray.push({
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    names: [schedule.name],
                });
            }
        });

        return groupsArray;
    }, [selectedList, ownerSchedules]); // 선택된 알바생 목록이 변경되거나 데이터베이스에 변경이 있을 때만 재계산

    /* ## 참고: 데이터 가져오는 방법 예시 ##
    // 데이터 가져오기 - 한 번만 실행
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("backend API 주소"); // 서버 API 요청
                const data: OwnerSchedule[] = await response.json(); // JSON 변환
                setOwnerSchedules(data); // Context 상태 업데이트
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };

        fetchData();
    }, []);
    */

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
