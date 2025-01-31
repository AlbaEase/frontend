import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./Pages/Common/LandingPage";
import LoginPage from "./Pages/Common/LoginPage";
import RegisterPage from "./Pages/Common/RegisterPage";
import OwnerMainPage from "./Pages/Owner/OwnerMainPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="landing" element={<LandingPage />}></Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="register" element={<RegisterPage />}></Route>
        <Route path="ownermain" element={<OwnerMainPage />}></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
