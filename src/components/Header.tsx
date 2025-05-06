import styles from "./Header.module.css";
import logo from "../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const Header = () => {
    const myLocation = useLocation();
    const nav = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("accessToken");
      
        try {
          if (token) {
            await axiosInstance.post(
              "/user/logout",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("🟢 서버 로그아웃 성공");
          }
        } catch (error) {
          console.error("🚨 로그아웃 중 서버 오류:", error);
        } finally {
          // 항상 토큰 삭제 및 페이지 이동
          localStorage.removeItem("accessToken");
          console.log("🍅 토큰 삭제 완료");
          nav("/login", { replace: true });
        }
      };
      

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img
                    src={logo} // 로고 파일 링크
                    alt="logo"
                    className={styles.logo}
                />
                <Link to="/ownermain" className={styles.title}>
                    알바이즈
                </Link>
            </div>
            <div className={styles.nav}>
                <Link
                    to="/ownermain"
                    className={`${styles.link} ${
                        myLocation.pathname === "/ownermain"
                            ? styles.active
                            : ""
                    }`}>
                    Calendar
                </Link>
                <Link
                    to="/ownermypage"
                    className={`${styles.link} ${
                        myLocation.pathname === "/ownermypage"
                            ? styles.active
                            : ""
                    }`}>
                    My Page
                </Link>
                <button onClick={handleLogout} className={styles.logout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
