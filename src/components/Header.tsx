import styles from "./Header.module.css";
import logo from "../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
    const myLocation = useLocation();
    const nav = useNavigate();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            try {
                const parsedUserInfo = JSON.parse(userInfo);
                setUserName(parsedUserInfo.name || "");
            } catch (error) {
                console.error("사용자 정보 파싱 오류:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        // 저장된 토큰 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        console.log("🍅 토큰 삭제 완료");
        // 로그아웃 처리 로직
        // 로그아웃 후 /login으로 리디렉션
        nav("/login", { replace: true });
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
                    {userName && <span className={styles.userName}> | {userName}</span>}
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
