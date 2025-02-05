import styles from "./Checkbox.module.css";
import { useState } from "react";

const Checkbox = () => {
    const employeesArray: string[] = [
        "이서영",
        "이은우",
        "김가윤",
        "김시현",
        "김지희",
        "조유성",
        "조정현",
    ];

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
