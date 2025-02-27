import styles from "./MyInformation.module.css";
import { useState, useEffect } from "react";
import axiosInstance from "../api/loginAxios";

const MyInformation = () => {

  // 항상 각자처리하던 거 한번에 처리해보기
  // 총이름, 전화번호, 비밀번호, 역할, 가게이름 초기값 설정하기
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phoneNumber: "",
    password: "********",
    role: "",
    storeName: "",
  });

  // useEffect사용하는 이유:

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 🔍 저장된 토큰 확인
    console.log("현재 저장된 토큰:", token);

    if (!token) {
      console.warn("🚨 토큰이 없습니다. 로그인 페이지로 이동하세요.");
      return;
    }
    // ✅ 토큰 디코딩하여 만료 시간 확인
    const decodeJWT = (token: string) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
      } catch (error) {
        console.error("🚨 JWT 디코딩 실패:", error);
        return null;
      }
    };

    const decoded = decodeJWT(token);
    console.log("🔍 디코딩된 토큰 정보:", decoded);

    if (decoded?.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.warn("🚨 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }
    }
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/user/me");
        console.log("🔍 서버 응답 데이터:", response.data); // ✅ 응답 데이터 확인

        setUserInfo((prev) => ({
          ...prev,
          fullName: response.data.fullName || "",
          phoneNumber: response.data.phoneNumber || "",
          role: response.data.role || "",
          storeName: response.data.storeName || "",
        }));
      } catch (error) {
        console.error("🚨 유저 정보를 가져오는 데 실패했습니다:", error);

        if (error.response?.status === 401) {
          console.warn("🚨 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.");
          localStorage.removeItem("accessToken"); // ❌ 만료된 토큰 삭제
          window.location.href = "/login"; // 🔄 로그인 페이지로 리디렉트
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className={styles.MyInformation}>
      <div
        className={styles.contentContainer}
        style={{ borderBottom: "1px black solid" }}
      >
        <div className={styles.title}>나의 정보</div>
        <div className={styles.content}>정보수정하기</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>이름</div>
        <div className={styles.content}>{userInfo.fullName}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>휴대폰 번호</div>
        <div className={styles.content}>{userInfo.phoneNumber}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>비밀번호</div>
        <div className={styles.content}>{userInfo.password}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>직업</div>
        <div className={styles.content}>{userInfo.role}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>근무 매장</div>
        <div className={styles.contentPlace}>{userInfo.storeName}</div>
      </div>
    </div>
  );
};

export default MyInformation;
