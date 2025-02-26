import styles from "./LoginPage.module.css";
import albaBoy from "../../assets/albaBoy.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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
    // 아이디, 비밀번호에 조건을 달았다. 백엔드에 요청을 넘기기 전에 1차적으로 거를 수 있도록
    const idValid = id.length >= 5 && id.length <= 15;
    const passwordValid =
      password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

    if (idValid && passwordValid) {
      try {
        const response = await axios.post(
          "http://3.39.237.218:8080/user/login",
          {
            id,
            password,
          }
        );

        if (response.status === 200) {
          // localStorage.setItem("token", response.data.token); // 토큰 저장
          // // 로그인 성공 시 페이지 이동
          navigate("/ownermain");
        } else {
          setErrorMessage("로그인 실패: 다시 시도해주세요.");
        }
      } catch (error) {
        setErrorMessage(
          "존재하지 않는 아이디와 비밀번호입니다. 다시 입력해주세요."
        );
      }
    } else {
      setErrorMessage(
        "아이디는 5자 이상, 15자 이하, 비밀번호는 8자 이상, 문자와 숫자가 혼합되어야 합니다."
      );
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
