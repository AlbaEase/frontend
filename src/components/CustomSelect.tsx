import React, { useState, useEffect } from "react";
import useSelector from "../hooks/useSelector"; // 기존 훅 사용
import styles from "./CustomSelect.module.css";
import arrow from "../assets/arrow-down.svg";
import { useOwnerSchedule } from "../contexts/OwnerScheduleContext";

interface Props {
    names: string[];
    onSelect: (name: string) => void;
}

const CustomSelect = ({ names = [], onSelect }: Props) => {
    // console.log("이름", names);
    const [isOpen, selectRef, toggleHandler] = useSelector();
    const [viewValue, setViewValue] = useState(names[0] || "근무자 선택");
    const { setSelectedName } = useOwnerSchedule();
    
    // 처음만 변경
    useEffect(() => {
        if (names.length > 0) {
            setSelectedName(names[0]);
            onSelect(names[0]);
        }
    }, []);

    const handleSelectValue = (e: React.MouseEvent<HTMLLIElement>) => {
        const selectedName = e.currentTarget.getAttribute("data-value") || "";
        setViewValue(selectedName);
        onSelect(selectedName);
        setSelectedName(selectedName); // 여기가 정상적으로 호출되는지 확인
        console.log("선택된 이름:", selectedName);
        toggleHandler();
    };

    return (
        <div className={styles.customSelect} ref={selectRef}>
            <div className={styles.label} onClick={toggleHandler}>
                {viewValue}
            </div>
            <img
                src={arrow}
                alt="arrow"
                className={styles.arrowSvg}
                onClick={toggleHandler}
            />
            {isOpen && (
                <ul className={styles.selectOption}>
                    {names.map((name, index) => (
                        <li
                            key={index}
                            data-value={name}
                            onClick={handleSelectValue}
                            className={styles.option}>
                            {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
