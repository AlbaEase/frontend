import styles from "./AlbaAdd.module.css";
import addBtn from "../assets/addBtn.svg";

const AlbaAdd = () => {
    return (
        <div className={styles.albaAdd}>
            <img src={addBtn} alt="addBtn" className={styles.addBtn}/>
        </div>
    );
};

export default AlbaAdd;
