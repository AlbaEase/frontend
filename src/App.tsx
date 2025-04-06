import "./App.css";
import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer";
import LandingPage from "./Pages/Common/LandingPage";
import LoginPage from "./Pages/Common/LoginPage";
import RegisterPage from "./Pages/Common/RegisterPage";
import OwnerMainPage from "./Pages/Owner/OwnerMainPage";
import OwnerMyPage from "./Pages/Owner/OwnerMyPage";
import OwnerMySalary from "./Pages/Owner/OwnerMySalary";
import OwnerMyChange from "./Pages/Owner/OwnerMyChange";
import EmployeeMyPage from "./Pages/Employee/EmployeeMyPage";
import EmployeeMySalary from "./Pages/Employee/EmployeeMySalary";
import EmployeeMyChange from "./Pages/Employee/EmployeeMyChange";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<LandingPage />}></Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="register" element={<RegisterPage />}></Route>
        <Route path="ownermain" element={<OwnerMainPage />}></Route>
        <Route path="ownermypage" element={<OwnerMyPage />}></Route>

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
    </>
  );
}

export default App;
