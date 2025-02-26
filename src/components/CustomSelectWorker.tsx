import React, { useEffect } from "react";
import styles from "./CustomSelectWorker.module.css"; // 스타일 파일

interface CustomSelectWorkerProps {
    names: string[]; // 근무자 이름 목록
    selectedWorkers: string[]; // 선택된 근무자 목록
    onSelect: React.Dispatch<React.SetStateAction<string[]>>; // 선택된 근무자 목록을 업데이트하는 함수
}

const CustomSelectWorker: React.FC<CustomSelectWorkerProps> = ({
    names,
    selectedWorkers,
    onSelect,
}) => {
    // 근무자 이름을 클릭했을 때 선택/해제하는 함수
    const handleSelectWorker = (worker: string) => {
        if (selectedWorkers.includes(worker)) {
            // 이미 선택된 근무자라면, 선택 해제
            onSelect(selectedWorkers.filter((name) => name !== worker));
        } else {
            // 선택되지 않은 근무자라면, 추가
            onSelect([...selectedWorkers, worker]);
        }
    };

    // selectedWorkers가 업데이트될 때마다 콘솔에 로그 찍기
    useEffect(() => {
        console.log("selectedWorkers 확인: ", selectedWorkers);
    }, [selectedWorkers]); // selectedWorkers가 변경될 때마다 실행됨

    return (
        <div className={styles.workerSelectContainer}>
            <ul className={styles.workerList}>
                {names.map((worker, index) => (
                    <li
                        key={index}
                        className={`${styles.workerItem} ${
                            selectedWorkers.includes(worker)
                                ? styles.selected
                                : ""
                        }`}
                        onClick={() => handleSelectWorker(worker)} // 클릭 시 선택/해제
                    >
                        {worker}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomSelectWorker;
