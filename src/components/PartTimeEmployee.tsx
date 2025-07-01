import styles from "./PartTime.module.css";
import CheckboxEmployee from "./CheckboxEmployee";
import { useEmployeeSchedule } from "../contexts/EmployeeScheduleContext";

const PartTime = () => {
    /* DB랑 연결 후, SelectRadio 값 따라 가져오기 */
    const { stores, selectedStore } = useEmployeeSchedule();

    /* selectedStore와 일치하는 storeId를 가진 매장의 storeCode 가져오기 */
    const selectedStoreData = stores.find(
        (store) => store.storeId === Number(selectedStore)
    );

    // console.log("⭐⭐ selectedStore: ", selectedStore);

    const storeCode = selectedStoreData
        ? selectedStoreData.storeCode
        : "매장 코드 없음";

    return (
        <div className={styles.parttime}>
            <div className={styles.title}>알바생</div>
            <div className={styles.checkbox}>
                <CheckboxEmployee />
            </div>
            <div className={styles.code}>{`매장 코드: ${storeCode}`}</div>
        </div>
    );
};

export default PartTime;
