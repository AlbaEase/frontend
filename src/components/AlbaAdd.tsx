import styles from "./AlbaAdd.module.css";
import addBtn from "../assets/addBtn.svg";

interface AlbaAddProps {
  onClick: () => void;
}

const AlbaAdd: React.FC<AlbaAddProps> = ({ onClick }) => {
  return (
    <div className={styles.albaAdd} onClick={onClick}>
      <img src={addBtn} alt="addBtn" className={styles.addBtn} />
    </div>
  );
};

export default AlbaAdd;
