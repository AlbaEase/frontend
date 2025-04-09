import style from "./EmployeeMyPage.module.css";
import { useState } from "react";

import EmployeeMyInfo from "../../components/employeeMy/EmployeeMyInfo";
import EmployeeNavBar from "../../components/employeeMy/EmployeeNavBar";
import MyHeader from "../../components/employeeMy/MyHeader";

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
