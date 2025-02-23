import styles from "./MyPageLeft.module.css";

type MyPageLeftProps = {
  setOpenComponent: (componentName: string) => void;
};
// 부모가 자식에게 전달한 상태 업데이트 함수를 사용헤서
// 클릭할 때마다 원하는 컴포넌트 랜더링 할 수 있도록 설정

const MyPageLeft: React.FC<MyPageLeftProps> = ({ setOpenComponent }) => {
  const handleMyInformation = () => setOpenComponent("MyInformation");
  const handleMySalary = () => setOpenComponent("MySalary");
  const handleMyChange = () => setOpenComponent("MyChange");

  return (
    <div className={styles.MyPageLeft}>
      <nav className={styles.container}>
        <div className={styles.nav} onClick={handleMyInformation}>
          나의 정보
        </div>
        <div className={styles.nav} onClick={handleMySalary}>
          근무/급여 확인
        </div>
        <div className={styles.nav} onClick={handleMyChange}>
          근무 변경 내용
        </div>
      </nav>
    </div>
  );
};

export default MyPageLeft;
