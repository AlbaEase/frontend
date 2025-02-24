import React, { useState, useEffect } from "react";
import useSelector from "../hooks/useSelector"; // 기존 훅 사용
import styles from "./CustomSelect.module.css"; // 스타일 파일

interface Props {
    names: string[];
    onSelect: (name: string) => void;
}

const CustomSelect = ({ names = [], onSelect }: Props) => {
    // console.log("이름", names);
    const [isOpen, selectRef, toggleHandler] = useSelector();
    const [viewValue, setViewValue] = useState(names[0] || "근무자 선택");

    useEffect(() => {
        if (names.length > 0) {
            onSelect(names[0]);
        }
    }, [names, onSelect]);

    const handleSelectValue = (e: React.MouseEvent<HTMLLIElement>) => {
        const selectedName = e.currentTarget.getAttribute("data-value") || "";
        setViewValue(selectedName);
        onSelect(selectedName);
        // console.log(selectedName);
        toggleHandler();
    };

    return (
        <div className={styles.customSelect} ref={selectRef}>
            <div className={styles.label} onClick={toggleHandler}>
                {viewValue}
            </div>
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
