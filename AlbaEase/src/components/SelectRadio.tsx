import styles from "./SelectRadio.module.css";
import { useState } from "react";

const SelectRadio = () => {
    const [stores] = useState<string[]>([
        "하노이맥주밤거리 부천역곡점",
        "투썸플레이스 일산덕이점",
        "이디야 성공회대점",
        "펠어커피 성신여대점",
        "오롯이",
        "온기과자점",
        "언앨리셰프"
    ]);
    const [selectedStore, setSelectedStore] =
        useState<string>("하노이맥주밤거리 부천역곡점");

    return (
        <div className={styles.selectRadioContainer}>
            <div className={styles.selectRadio}>
                <div className={styles.selectBtn}>
                    {stores.map((store) => (
                        <label key={store} className={styles.selectLabel}>
                            <input
                                type="radio"
                                name="store"
                                value={store}
                                checked={selectedStore === store}
                                onChange={(e) =>
                                    setSelectedStore(e.target.value)
                                }
                            />
                            {store}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectRadio;
