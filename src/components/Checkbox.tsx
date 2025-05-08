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

    // 사용자 정보 로드
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

        console.log("스케줄 데이터에서 직원 목록 추출 시작:", ownerSchedules);
        
        // 중복 이름 제거하여 직원 목록 생성
        const uniqueEmployeeNames = Array.from(
            new Set(ownerSchedules.map(schedule => schedule.fullName))
        ).filter(Boolean);

        console.log("추출된 직원 이름 목록:", uniqueEmployeeNames);
        setEmployeeArray(uniqueEmployeeNames);
        
        // 사용자 유형에 따라 선택 목록 처리
        if (userInfo?.userType === "EMPLOYEE") {
            // 직원인 경우 자신의 이름만 포함
            const currentUserName = userInfo.name;
            // 이름 형식을 확인해서, fullName과 name이 정확히 일치하는지 필터링
            // data.sql에서는 full name을 사용하고 일부 로그인 시스템은 name만 사용할 수 있음
            const matchingNames = uniqueEmployeeNames.filter(name => 
                name.includes(currentUserName) || currentUserName.includes(name)
            );
            
            if (matchingNames.length > 0) {
                console.log("현재 사용자와 일치하는 이름 찾음:", matchingNames);
                setSelectedList(matchingNames);
            } else {
                console.log("현재 사용자와 일치하는 이름을 찾지 못함, 표시 가능한 모든 이름:", uniqueEmployeeNames);
                // 직원 유형이지만 이름이 일치하지 않으면, 표시 가능한 이름 중 첫 번째를 선택
                if (uniqueEmployeeNames.length > 0) {
                    setSelectedList([uniqueEmployeeNames[0]]);
                } else {
                    setSelectedList([]);
                }
            }
        } else {
            // 사장인 경우 모든 직원 선택
            console.log("사장님 권한으로 모든 직원 선택");
            setSelectedList(uniqueEmployeeNames);
        }
    }, [ownerSchedules, userInfo, setSelectedList]);

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
