import styles from "./Header.module.css";
import logo from "../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const Header = () => {
    const myLocation = useLocation();
    const nav = useNavigate();
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState(""); // 사용자 타입(OWNER/EMPLOYEE)
    
    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            try {
                const parsedUserInfo = JSON.parse(userInfo);
                setUserName(parsedUserInfo.name || "");
                setUserType(parsedUserInfo.userType || ""); // 사용자 타입 설정
                console.log("사용자 정보:", parsedUserInfo); // 디버깅용 로그
            } catch (error) {
                console.error("사용자 정보 파싱 오류:", error);
            }
        }
    }, []);
    
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
            localStorage.removeItem("userInfo");
            console.log("🍅 토큰 삭제 완료");
            nav("/login", { replace: true });
        }
    };
    
    // 사용자 타입에 따라 메인 페이지 경로 결정
    const getMainPath = () => {
        return userType === "EMPLOYEE" ? "/employeemain" : "/ownermain";
    };
    
    // 사용자 타입에 따라 마이페이지 경로 결정
    const getMyPagePath = () => {
        return userType === "EMPLOYEE" ? "/employeemypage" : "/ownermypage";
    };
    
    const mainPath = getMainPath();
    const myPagePath = getMyPagePath();
    
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img
                    src={logo} // 로고 파일 링크
                    alt="logo"
                    className={styles.logo}
                />
                <Link to={mainPath} className={styles.title}>
                    알바이즈
                    {userName && <span className={styles.userName}> | {userName}</span>}
                </Link>
            </div>
            <div className={styles.nav}>
                <Link
                    to={mainPath}
                    className={`${styles.link} ${
                        myLocation.pathname === mainPath
                            ? styles.active
                            : ""
                    }`}>
                    Calendar
                </Link>
                <Link
                    to={myPagePath}
                    className={`${styles.link} ${
                        myLocation.pathname === myPagePath
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