import React, { useEffect } from "react";
import styles from "./CustomSelectWorker.module.css"; // 스타일 파일

// 근무자 정보 인터페이스 정의
interface WorkerInfo {
  id: string; // 사용자 ID (문자열 형태로)
  name: string; // 사용자 이름
}

interface CustomSelectWorkerProps {
    names: string[] | WorkerInfo[]; // 근무자 목록 (문자열 또는 객체 배열)
    selectedWorkers: string[]; // 선택된 근무자 ID 목록
    onSelect: React.Dispatch<React.SetStateAction<string[]>>; // 선택된 근무자 목록을 업데이트하는 함수
}

const CustomSelectWorker: React.FC<CustomSelectWorkerProps> = ({
    names,
    selectedWorkers,
    onSelect,
}) => {
    // 근무자가 객체인지 문자열인지 확인
    const isObjectArray = names.length > 0 && typeof names[0] !== 'string';
    
    // 근무자 정보 배열로 변환
    const workerInfos: WorkerInfo[] = isObjectArray 
        ? names as WorkerInfo[]
        : (names as string[]).map(name => ({ id: name, name }));
    
    // 컴포넌트 마운트 시 근무자 목록 로깅
    useEffect(() => {
        console.log("CustomSelectWorker - 근무자 목록:", workerInfos);
    }, [workerInfos]);
    
    // 근무자를 클릭했을 때 선택/해제하는 함수
    const handleSelectWorker = (workerId: string, workerName: string) => {
        console.log(`근무자 선택 클릭 - ID: ${workerId}, 이름: ${workerName}`);
        
        if (selectedWorkers.includes(workerId)) {
            // 이미 선택된 근무자라면, 선택 해제
            console.log(`근무자 선택 해제: ${workerId}`);
            onSelect(selectedWorkers.filter((id) => id !== workerId));
        } else {
            // 선택되지 않은 근무자라면, 추가
            console.log(`근무자 선택 추가: ${workerId}`);
            onSelect([workerId]); // 단일 선택으로 변경 (다중 선택 대신)
        }
    };

    // selectedWorkers가 업데이트될 때마다 콘솔에 로그 찍기
    useEffect(() => {
        console.log("CustomSelectWorker - 선택된 근무자 ID 목록: ", selectedWorkers);
        
        // 선택된 근무자 정보 출력
        if (selectedWorkers.length > 0) {
            const selectedWorkerInfo = workerInfos.find(worker => worker.id === selectedWorkers[0]);
            if (selectedWorkerInfo) {
                console.log(`선택된 근무자 정보 - ID: ${selectedWorkerInfo.id}, 이름: ${selectedWorkerInfo.name}`);
            }
        }
    }, [selectedWorkers, workerInfos]); // selectedWorkers가 변경될 때마다 실행됨

    return (
        <div className={styles.workerSelectContainer}>
            <ul className={styles.workerList}>
                {workerInfos.map((worker, index) => (
                    <li
                        key={index}
                        className={`${styles.workerItem} ${
                            selectedWorkers.includes(worker.id)
                                ? styles.selected
                                : ""
                        }`}
                        onClick={() => handleSelectWorker(worker.id, worker.name)} // 클릭 시 선택/해제
                    >
                        {worker.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomSelectWorker;
