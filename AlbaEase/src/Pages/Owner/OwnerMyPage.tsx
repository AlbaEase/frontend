import styles from "./OwnerMyPage.module.css";
import Header from "../../components/Header";
import MyPageLeft from "../../components/MyPageLeft";

const OwnerMyPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.ownerMyPage}>
        <Header />
        <div className={styles.title}>My Page</div>
        <div className={styles.contents}>
          <MyPageLeft />
          <div>내용이 들어올 예정</div>
        </div>
      </div>
    </div>
  );
};

export default OwnerMyPage;
