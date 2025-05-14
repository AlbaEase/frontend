import "./App.css";
import { Routes, Route } from "react-router-dom";
import { WebSocketProvider } from "./contexts/WebSocketContext";

import Footer from "./components/Footer";
import LandingPage from "./Pages/Common/LandingPage";
import LoginPage from "./Pages/Common/LoginPage";
import RegisterPage from "./Pages/Common/RegisterPage";
import OwnerMainPage from "./Pages/Owner/OwnerMainPage";
import OwnerMyPage from "./Pages/Owner/OwnerMyPage";
import OwnerMySalary from "./Pages/Owner/OwnerMySalary";
import OwnerMyChange from "./Pages/Owner/OwnerMyChange";
import EmployeeMainPage from "./Pages/Employee/EmployeeMainPage";
import EmployeeMyPage from "./Pages/Employee/EmployeeMyPage";
import EmployeeMySalary from "./Pages/Employee/EmployeeMySalary";
import EmployeeMyChange from "./Pages/Employee/EmployeeMyChange";
import { useEffect } from "react";
import { checkAuthAndSetToken } from "./api/apiService";
import { setupScheduleUpdateListener } from "./components/Calendar";

function App() {
  // 앱이 로드될 때 인증 상태 확인
  useEffect(() => {
    checkAuthAndSetToken();
    
    // 스케줄 업데이트 이벤트 리스너 설정
    setupScheduleUpdateListener();
    
    // 컴포넌트 언마운트 시 필요한 정리 작업은 여기에 추가
    return () => {
      // 이벤트 리스너 제거 등의 작업
    };
  }, []);

  return (
    <WebSocketProvider>
      <Routes>
        <Route path="" element={<LandingPage />}></Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="register" element={<RegisterPage />}></Route>
        <Route path="ownermain" element={<OwnerMainPage />}></Route>
        <Route path="ownermypage" element={<OwnerMyPage />}></Route>
        <Route path="ownermysalary" element={<OwnerMySalary />}></Route>
        <Route path="ownermychange" element={<OwnerMyChange />}></Route>
        <Route path="employeemain" element={<EmployeeMainPage />}></Route>
        <Route path="employeemypage" element={<EmployeeMyPage />}></Route>
        <Route
          path="employeemypage/mysalary"
          element={<EmployeeMySalary />}
        ></Route>
        <Route
          path="employeemypage/mychange"
          element={<EmployeeMyChange />}
        ></Route>
      </Routes>
      <Footer />
    </WebSocketProvider>
  );
}

export default App;
