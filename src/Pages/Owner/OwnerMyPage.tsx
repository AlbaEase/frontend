import styles from "./OwnerMyPage.module.css";
import Header from "../../components/Header";
import MyPageLeft from "../../components/MyPageLeft";
import MyInformation from "../../components/MyInformation";
import MySalary from "../../components/MySalary";
import MyChange from "../../components/MyChange";
import { useState } from "react";

const OwnerMyPage = () => {
  // 내정보, 급여, 변경사항 이 세개를 조건부로 랜더링 할 것이다.
  const [openComponent, setOpenComponent] = useState<string>("MyInformation");

  const renderContent = () => {
    switch (openComponent) {
      case "MyInformation":
        return <MyInformation />;
      case "MySalary":
        return <MySalary />;
      case "MyChange":
        return <MyChange />;
      default:
        return <MyInformation />;
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.ownerMyPage}>
        <Header />
        <div className={styles.title}>My Page</div>
        <div className={styles.contents}>
          {/* 현재 어떤 컴포넌트를 랜더링 시킬 건지 상태 업데이트 함수를 props로 전달 */}
          <MyPageLeft setOpenComponent={setOpenComponent} />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default OwnerMyPage;
