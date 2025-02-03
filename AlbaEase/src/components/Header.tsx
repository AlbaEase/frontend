import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const myLocation = useLocation();
    // const nav = useNavigate();

    // const handleLogout = () => {
    //     // 로그아웃 처리 로직
    //     // 로그아웃 후 /login으로 리디렉션
    //     nav("/login", { replace: true });
    // };
    // <button onClick={handleLogout} className={styles.link}>
    //     Logout
    // </button>;

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img
                    src={logo} // 로고 파일 링크
                    alt="logo"
                    className={styles.logo}
                />
                <Link to="/ownermain" className={styles.title}>알바이즈</Link>
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
                <Link to="/login" className={styles.link}>
                    Logout
                </Link>
            </div>
        </header>
    );
};

export default Header;
