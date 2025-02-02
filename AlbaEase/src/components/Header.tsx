import styles from "./Header.module.css";
import logo from "../assets/logo.png"
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const myLocation = useLocation();

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img
                    src={logo} // 로고 파일 링크
                    alt="logo"
                    className={styles.logo}
                />
                <span className={styles.title}>
                    알바이즈
                </span>
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
