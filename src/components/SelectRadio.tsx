import styles from "./SelectRadio.module.css";
import { useOwnerSchedule } from "../contexts/OwnerScheduleContext";

const SelectRadio = () => {
    const { stores, selectedStore, setSelectedStore } = useOwnerSchedule();

    // stores가 undefined일 경우 빈 배열로 설정
    const safeStores = stores || [];

    return (
        <div className={styles.selectRadioContainer}>
            <div className={styles.selectRadio}>
                <div className={styles.selectBtn}>
                    {safeStores.length > 0 ? (
                        safeStores.map((store) => {
                            console.log("store:", store); // ✅ 여기에 콘솔 추가!

                            return (
                                <label
                                    key={store.storeId}
                                    className={styles.selectLabel}>
                                    <input
                                        type="radio"
                                        name="store"
                                        value={store.storeId}
                                        checked={selectedStore === store.storeId}
                                        onChange={(e) =>
                                            setSelectedStore(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                    {store.name}
                                </label>
                            );
                        })
                    ) : (
                        <p>가게 목록이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectRadio;
