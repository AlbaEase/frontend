import style from "../Employee/EmployeeMyPage.module.css";


import EmployeeMyInfo from "./my/OwnerMyInfo";
import EmployeeNavBar from "./my/Navbar";
import MyHeader from "./my/Header";

const EmployeeMyPage = () => {


  return (
    <div className={style.employeeMyPage}>
      <div className={style.contents}>
        {/* 헤더 */}
        <MyHeader />
        <div className={style.title}>My Page</div>
        <div className={style.components}>
          <EmployeeNavBar />
          <EmployeeMyInfo />
        </div>
      </div>
    </div>
  );
};

export default EmployeeMyPage;
