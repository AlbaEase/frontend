import styles from "./MyInformation.module.css";
import { useState, useEffect } from "react";
import axiosInstance from "../api/loginAxios";

const MyInformation = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    password: "********",
    role: "",
    storeNames: [] as string[],
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/user/me");
        console.log("🔍 유저 정보:", response.data);

        setUserInfo({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          password: "********", // 실제 비번은 보여주지 않음
          role: response.data.role || "",
          storeNames: response.data.storeNames || [],
        });
      } catch (error: any) {
        console.error("유저 정보 불러오기 실패:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
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
        <div className={styles.title}>이메일</div>
        <div className={styles.content}>{userInfo.email}</div>
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
        <div className={styles.contentPlace}>{userInfo.storeNames}</div>
      </div>
    </div>
  );
};

export default MyInformation;
