import styles from "./MyHeader.module.css";
import logo from "../../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MyHeader = () => {
  const myLocation = useLocation();
  const nav = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        // 이름 표시 우선순위: fullName > name > email
        const displayName = parsedUserInfo.fullName || parsedUserInfo.name || parsedUserInfo.email?.split('@')[0] || "";
        setUserName(displayName);
        console.log("사용자 정보 (MyHeader):", parsedUserInfo);
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
        <Link to="/employeemain" className={styles.title}>
          알바이즈
          {userName && <span className={styles.userName}> | {userName}</span>}
        </Link>
      </div>
      <div className={styles.nav}>
        <Link
          to="/employeemain"
          className={`${styles.link} ${
            myLocation.pathname === "/employeemain" ? styles.active : ""
          }`}
        >
          Calendar
        </Link>
        <Link
          to="/employeemypage"
          className={`${styles.link} ${
            myLocation.pathname === "/employeemypage" ? styles.active : ""
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
