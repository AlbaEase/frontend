import styles from "./LoginPage.module.css";
import albaBoy from "../../assets/albaBoy.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import axiosInstance from "../../api/loginAxios";

// interface FormData {
//   id: string;
//   password: string;
// }

const LoginPage = () => {
  // const [formDate, setFormDate] = useState<FormData>({
  //   id: "",
  //   password: "",
  // });

  // email, password 상태관리
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setPassword(e.target.value);
  };

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  // 조건은 좀 더 생각해보기

  const handleLogin = async () => {
    delete axiosInstance.defaults.headers["Authorization"];
    // 이메일 형식 및 비밀번호 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("유효한 이메일 주소를 입력해 주세요.");
      return;
    }
    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      setErrorMessage("비밀번호는 8자 이상, 문자와 숫자를 포함해야 합니다.");
      return;
    }

    try {
      // axiosInstance를 사용하여 로그인 요청
      const response = await axiosInstance.post("/user/login", {
        email,
        password,

      },{
    headers: {
      Authorization: undefined, // 🔥 이 줄이 핵심!
    },
  });

      });
      
      // 응답 데이터 자세히 출력

      console.log("🔍 로그인 응답 데이터:", response.data);
      
      // 응답에서 토큰과 사용자 정보 추출 (백엔드 응답 구조에 맞게 조정)
      const { token, role, fullName, userId, userType } = response.data;
      
      if (!token) {
        console.error("🚨 서버 응답에 토큰이 없음!", response.data);
        setErrorMessage("서버에서 인증 토큰을 받지 못했습니다.");
        return;
      }

      console.log("✅ 받은 토큰:", token);
      console.log("✅ 사용자 역할:", role);
      console.log("✅ 사용자 이름:", fullName);
      console.log("✅ 사용자 ID:", userId);
      
      // 토큰은 Bearer 접두사 없이 저장 (백엔드에서 처리함)
      localStorage.setItem("accessToken", token);
      
      // 사용자 정보 객체 생성 - 백엔드 응답 구조 매핑
      // 특수 케이스: 특정 이메일에 대해 하드코딩된 userId 사용
      let resolvedUserId = userId;
      
      // 백엔드에서 userId가 제공되지 않았거나 올바르지 않은 경우
      if (resolvedUserId === undefined || resolvedUserId === null) {
        // 이메일에 따라 임시 userId 할당 (더미 데이터 기반)
        if (email === 'staff1@albaease.com') { // 김시현
          resolvedUserId = 3;
          console.log("✅ 이메일 기반으로 사용자 ID 할당 (김시현):", resolvedUserId);
        } else if (email === 'staff2@albaease.com') { // 김지희
          resolvedUserId = 4;
          console.log("✅ 이메일 기반으로 사용자 ID 할당 (김지희):", resolvedUserId);
        } else if (email === 'staff3@albaease.com') { // 이서영
          resolvedUserId = 5;
          console.log("✅ 이메일 기반으로 사용자 ID 할당 (이서영):", resolvedUserId);
        } else if (email === 'staff4@albaease.com') { // 조정현
          resolvedUserId = 6;
          console.log("✅ 이메일 기반으로 사용자 ID 할당 (조정현):", resolvedUserId);
        } else if (email === 'staff5@albaease.com') { // 이은우
          resolvedUserId = 7;
          console.log("✅ 이메일 기반으로 사용자 ID 할당 (이은우):", resolvedUserId);
        }
      }
      
      const userInfo = {
        userId: resolvedUserId !== undefined ? resolvedUserId : null,
        name: fullName || "",
        userType: userType || role,
        email,
        role
      };
      
      console.log("✅ 최종 사용자 정보:", userInfo);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      
      console.log("✅ 저장된 토큰 확인:", localStorage.getItem("accessToken"));
      console.log("✅ 저장된 사용자 정보:", localStorage.getItem("userInfo"));
      
      // 모든 요청에 Authorization 헤더 추가
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

      // 역할에 따른 라우팅 분기
      if (role === "OWNER" || userType === "OWNER") {
        navigate("/ownermain");
      } else if (role === "WORKER" || role === "EMPLOYEE" || userType === "EMPLOYEE") {
        navigate("/employeemain");
      } else {
        navigate("/defaultMain");
      }
    } catch (error) {
      console.error("🚨 로그인 요청 실패:", error);
      setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY; // .env에서 키를 가져와서 사용

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 리다이렉트
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${SERVICE_KEY}&redirect_uri=http://localhost:5174/auth/kakao/callback&response_type=code`;
    window.location.href = kakaoLoginUrl;
  };

  // 로그인 시 에러나 오류를 alert()로 만들었는데 -> 모달 또는 UI컴포넌트 기반 메시지로 바꾸기

  return (
    <div className={styles.loginPage}>
      <div className={styles.content}>
        <div className={styles.contentPosition}>
          <div style={{ fontSize: "50px" }}>
            Sign in to
            <div style={{ fontSize: "35px" }}>AlbaEase</div>
          </div>
          <div className={styles.content2}>
            <div>
              만약, 알바이즈에 가입되어 있지 않으시다면
              <br />
              <Link to="../register">여기를 클릭</Link>해 회원가입 하세요!!
            </div>
            <div>
              <img src={albaBoy} alt="albaBoy" className={styles.img} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.loginForm}>
          <div style={{ fontSize: "30px" }}>Sign in</div>
          <div>
            <input
              className={styles.input}
              type="text"
              value={email}
              onChange={handleEmail}
              placeholder="이메일"
            />
          </div>
          <div>
            {/* 비밀번호 확인할 수 있는 기능 구현하기 */}
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="Password"
            />
          </div>
          <div className={styles.fontStyle}>비밀번호를 잃어버리셨나요?</div>
          <div className={styles.errorMessage}>{errorMessage}</div>
          <div style={{ marginTop: "40px" }}>
            <button className={styles.button} onClick={handleLogin}>
              Login
            </button>
            <p className={styles.fontStyle} style={{ textAlign: "center" }}>
              or
            </p>
            <button
              className={styles.button}
              style={{ backgroundColor: "yellow", color: "black" }}
              onClick={handleKakaoLogin}
            >
              카카오 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
