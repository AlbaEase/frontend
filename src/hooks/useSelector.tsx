import styles from "./CustomSelect.module.css";
import React, { useRef, useEffect, useState } from "react";

type useSelect = [
    boolean,
    React.MutableRefObject<HTMLDivElement | null>,
    () => void
];

const useSelector = (): useSelect => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement | HTMLInputElement>(null);

    const toggleHandler = () => setIsOpen(!isOpen); // 셀렉트박스 여닫는 토글

    // 드롭다운 외부를 클릭했을 때 닫히도록록
    const handleClickOutside = (e: React.BaseSyntheticEvent | MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target)) setIsOpen(!isOpen);
    };

    /* 이벤트 리스너 등록 및 해제
     * 열려있을 때 handleClickOutside 실행
     * 닫혀 있을 때 이벤트 리스너 제거 */
    useEffect(() => {
        if (isOpen) {
            window.addEventListener("click", handleClickOutside);
            return () =>
                window.removeEventListener("click", handleClickOutside);
        }
    }, [isOpen]);

    /* 반환되는 것
     * 1. 열려있는지 여부
     * 2. 해당 엘리먼트 기억
     * 3. 해당 요소 행동 제어
     */
    return [isOpen, ref, toggleHandler];
};

export default useSelector;
