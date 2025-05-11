import styles from "./Checkbox.module.css";
import { useState, useEffect } from "react";
import { useOwnerSchedule } from "../contexts/OwnerScheduleContext";

// 사용자 정보 타입 정의
interface UserInfo {
    name: string;
    userType: "OWNER" | "EMPLOYEE";
    userId: number;
    email?: string;
    role?: string;
}

const Checkbox = () => {
    /* 컨텍스트에서 값 가져오기 */
    const { selectedList, setSelectedList, ownerSchedules } = useOwnerSchedule();
    const [employeesArray, setEmployeeArray] = useState<string[]>([]);
    /* 체크박스 선택 관리 */
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const token = localStorage.getItem("accessToken"); // 토큰 가져오기

    // console.log("selectedList: ", selectedList);
    // console.log("selectedStore:", selectedStore);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo) as UserInfo;
                setUserInfo(parsedUserInfo);
                console.log("체크박스에 로드된 사용자 정보:", parsedUserInfo);
            } catch (error) {
                console.error("사용자 정보 파싱 오류:", error);
            }
        }
    }, []);

    // OwnerScheduleContext에서 가져온 ownerSchedules에서 직원 이름 목록 추출
    useEffect(() => {
        if (!ownerSchedules.length) {
            console.log("스케줄 데이터가 없어 직원 목록을 생성할 수 없습니다.");
            setEmployeeArray([]);
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

    // 직원 목록이 업데이트될 때 isAllSelected 상태 업데이트
    useEffect(() => {
        setIsAllSelected(
            employeesArray.length > 0 && 
            selectedList.length === employeesArray.length
        );
    }, [employeesArray, selectedList]);

    // 문자열 정렬 (오름차순)
    const sortedArray: string[] = [...employeesArray].sort();

    /* 전체 선택 및 해제 */
    const handleAllSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedList(sortedArray);
        } else {
            // 선택이 해제되면
            setSelectedList([]);
        }
    };

    /* 개별 선택 및 해제 */
    const handleSingleSelect = (name: string) => {
        setSelectedList((prev) => {
            const newList = prev.includes(name)
                ? prev.filter((item) => item !== name)
                : [...prev, name];
            return newList;
        });
    };

    // 직원 권한인 경우 체크박스 비활성화
    const isEmployeeUser = userInfo?.userType === "EMPLOYEE";

    return (
        <div className={styles.checkbox}>
            <label key={"전체 선택"} className={styles.selectAll}>
                <input
                    type="checkbox"
                    onChange={handleAllSelect}
                    checked={isAllSelected}
                    disabled={isEmployeeUser} // 직원인 경우 비활성화
                />
                {"전체 선택"}
            </label>
            {sortedArray.map((employeeName, index) => {
                const repeatedClassName = `name${(index % 10) + 1}`; // 1부터 10까지 반복
                return (
                    <label 
                        key={employeeName} 
                        className={`${styles[repeatedClassName]} ${isEmployeeUser ? styles.disabled : ''}`}
                    >
                        <input
                            type="checkbox"
                            onChange={() => handleSingleSelect(employeeName)}
                            checked={selectedList.includes(employeeName)}
                            disabled={isEmployeeUser} // 직원인 경우 비활성화
                        />
                        {employeeName}
                    </label>
                );
            })}
        </div>
    );
};

export default Checkbox;
