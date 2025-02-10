import styles from "./Checkbox.module.css";
import { useState, useEffect } from "react";
import { useOwnerSchedule } from "../contexts/OwnerScheduleContext";

const Checkbox = () => {
    /* DB 연결 */
    const { selectedStore } = useOwnerSchedule();
    const [employeesArray, setEmployeeArray] = useState<string[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // 첫 번째 API: store_id가 1인 직원의 user_id 목록을 가져오기
                const res = await fetch(
                    `http://localhost:8080/schedules/store/${selectedStore}`
                );
                if (!res.ok) {
                    throw new Error("직원 목록 가져오기 실패");
                }
                const scheduleData = await res.json();

                console.log(scheduleData);

                // Set을 사용하여 중복된 user.userId 제거
                const uniqueUserIds = new Set(
                    scheduleData.map((schedule: any) => schedule.user.userId)
                );

                // 중복된 user.userId를 제거한 후, user.name을 가져와서 배열에 저장
                const employeeNames = [...uniqueUserIds].map((userId) => {
                    const schedule = scheduleData.find(
                        (schedule: any) => schedule.user.userId === userId
                    );
                    return schedule?.user?.name; // 해당 user_id에 해당하는 name만 가져옴
                });

                // 이름만 저장된 배열을 상태에 저장
                setEmployeeArray(employeeNames);
            } catch (error) {
                console.error("직원 목록 불러오기 실패: ", error);
            }
        };

        fetchEmployees();
    }, [selectedStore]);

    // 문자열 정렬 (오름차순)
    const sortedArray: string[] = employeesArray.sort();

    /* 체크박스 선택 관리 */
    const [SelectedList, setSelectedList] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    /* 전체 선택 및 해제 */
    const handleAllSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedList(sortedArray);
        } else {
            // 선택이 해제되면
            setSelectedList([]);
        }
        setIsAllSelected(e.target.checked);
    };

    /* 개별 선택 및 해제 */
    const handleSingleSelect = (name: string) => {
        setSelectedList((prev) => {
            const newList = prev.includes(name)
                ? prev.filter((item) => item !== name)
                : [...prev, name];

            // 만약 일일이 선택해서 전체 선택이 되면 전체 선택 버튼 활성화
            setIsAllSelected(newList.length === sortedArray.length);
            return newList;

            // if (prev.includes(name)) {
            //     return prev.filter((item) => item !== name);
            // } else {
            //     return [...prev, name];
            // }
        });
    };

    console.log(SelectedList);

    return (
        <div className={styles.checkbox}>
            <label key={"전체 선택"} className={styles.selectAll}>
                <input
                    type="checkbox"
                    onChange={handleAllSelect}
                    checked={isAllSelected}
                />
                {"전체 선택"}
            </label>
            {sortedArray.map((employeeName) => (
                <label key={employeeName}>
                    <input
                        type="checkbox"
                        onChange={() => handleSingleSelect(employeeName)}
                        checked={SelectedList.includes(employeeName)}
                    />
                    {employeeName}
                </label>
            ))}
        </div>
    );
};

export default Checkbox;
