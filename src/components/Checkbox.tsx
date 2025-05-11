import styles from "./Checkbox.module.css";
import { useState, useEffect } from "react";
import { useOwnerSchedule } from "../contexts/OwnerScheduleContext";
import axiosInstance from "../api/loginAxios";

const Checkbox = () => {
    /* DB 연결 */
    const { selectedStore, selectedList, setSelectedList } = useOwnerSchedule();
    const [employeesArray, setEmployeeArray] = useState<string[]>([]);
    /* 체크박스 선택 관리 */
    const [isAllSelected, setIsAllSelected] = useState(false);

    const token = localStorage.getItem("accessToken"); // 토큰 가져오기

    // console.log("selectedList: ", selectedList);
    // console.log("selectedStore:", selectedStore);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                console.log("useEffect 실행 확인");
                if (!token) {
                    console.error("토큰이 없습니다. 인증을 확인하세요.");
                    return;
                }

                // 첫 번째 API: store_id가 1인 직원의 user_id 목록을 가져오기
                const res = await axiosInstance.get(
                    `http://3.39.237.218:8080/schedule/store/${selectedStore}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const scheduleData = res.data;

                // Set을 사용하여 중복된 user.userId 제거
                const uniqueUserIds = new Set(
                    scheduleData.map((schedule: any) => schedule.userId)
                );

                // 중복된 userId를 제거한 후, fullName을 가져와서 배열에 저장
                const employeeNames = [...uniqueUserIds].map((userId) => {
                    const schedule = scheduleData.find(
                        (schedule: any) => schedule.userId === userId
                    );
                    return schedule?.fullName; // 해당 user_id에 해당하는 name만 가져옴
                });

                // 이름만 저장된 배열을 상태에 저장
                setEmployeeArray(employeeNames);
            } catch (error: any) {
                if (error.response) {
                    console.error("응답 오류 데이터:", error.response.data);
                } else {
                    console.error("직원 목록 불러오기 실패: ", error);
                }
            }
            
        };

        fetchEmployees();
    }, [selectedStore]);

    // console.log("scheduleData: ", scheduleData);

    // 직원 목록이 업데이트되면 selectedList도 자동으로 업데이트
    useEffect(() => {
        if (employeesArray.length > 0) {
            setSelectedList(employeesArray);
            setIsAllSelected(true);
        }
    }, [employeesArray, setSelectedList]);

    // 문자열 정렬 (오름차순)
    const sortedArray: string[] = employeesArray.sort();

    /* 전체 선택 및 해제 */
    const handleAllSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedList(sortedArray);
        } else {
            // 선택이 해제되면
            setSelectedList([]);
        }
        // setIsAllSelected(e.target.checked);
    };

    /* 개별 선택 및 해제 */
    const handleSingleSelect = (name: string) => {
        setSelectedList((prev) => {
            const newList = prev.includes(name)
                ? prev.filter((item) => item !== name)
                : [...prev, name];

            // 만약 일일이 선택해서 전체 선택이 되면 전체 선택 버튼 활성화
            // setIsAllSelected(newList.length === sortedArray.length);
            return newList;

            // if (prev.includes(name)) {
            //     return prev.filter((item) => item !== name);
            // } else {
            //     return [...prev, name];
            // }
        });
    };

    // isAllSelected 업데이트를 useEffect로 분리하여 렌더링 후 실행
    useEffect(() => {
        setIsAllSelected(selectedList.length === sortedArray.length);
    }, [selectedList, sortedArray]);

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
            {sortedArray.map((employeeName, index) => {
                const repeatedClassName = `name${(index % 10) + 1}`; // 1부터 10까지 반복
                return (
                    <label key={employeeName} className={styles[repeatedClassName]}>
                        <input
                            type="checkbox"
                            onChange={() => handleSingleSelect(employeeName)}
                            checked={selectedList.includes(employeeName)}
                        />
                        {employeeName}
                    </label>
                );
            })}
        </div>
    );
};

export default Checkbox;