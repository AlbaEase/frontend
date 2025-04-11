import styles from "./MyHeader.module.css";
import logo from "../../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MyHeader = () => {
  const myLocation = useLocation();
  const nav = useNavigate();

  const handleLogout = () => {
    // 저장된 토큰 삭제
    localStorage.removeItem("accessToken");
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
        </Link>
      </div>
      <div className={styles.nav}>
        <Link
          to="/employeemain"
          className={`${styles.link} ${
            myLocation.pathname === "/ownermain" ? styles.active : ""
          }`}
        >
          Calendar
        </Link>
        <Link
          to="/employeemypage"
          className={`${styles.link} ${
            myLocation.pathname === "/ownermypage" ? styles.active : ""
          }`}
        >
          My Page
        </Link>
        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default MyHeader;
