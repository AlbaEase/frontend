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

  // id, password 상태관리
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleId = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setId(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setPassword(e.target.value);
  };

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  // 조건은 좀 더 생각해보기

  const handleLogin = async () => {
    if (id.length < 5 || id.length > 15) {
      setErrorMessage("아이디는 5자 이상, 15자 이하입니다.");
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
      // ✅ axiosInstance 사용 (로그인 요청에는 자동으로 Authorization 헤더 제외됨)
      const response = await axiosInstance.post("/user/login", {
        id,
        password,
      });

      console.log("🔍 로그인 응답 데이터:", response.data);

      const token = response.data;
      if (!token) {
        console.error("🚨 서버 응답에 토큰이 없음!", response.data);
        setErrorMessage("서버에서 인증 토큰을 받지 못했습니다.");
        return;
      }

      console.log("✅ 받은 토큰:", token);

      // ✅ `localStorage`에 저장한 후 axiosInstance 헤더 업데이트
      localStorage.setItem("accessToken", token);
      console.log("✅ 저장된 토큰 확인:", localStorage.getItem("accessToken"));

      // ✅ 로그인 후 axiosInstance의 Authorization 헤더를 업데이트
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

      navigate("/ownermain");
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
              value={id}
              onChange={handleId}
              placeholder="ID"
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
