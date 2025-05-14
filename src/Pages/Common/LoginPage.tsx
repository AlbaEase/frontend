import styles from "./LoginPage.module.css";
import albaBoy from "../../assets/albaBoy.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance, { setAuthToken, setUserInfo, UserInfo } from "../../api/loginAxios";

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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setPassword(e.target.value);
  };

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  // 사용자 정보 조회 함수 - JWT 토큰으로 서버에서 조회
  const fetchUserInfo = async (token: string): Promise<UserInfo | null> => {
    try {
      console.log("💡 사용자 정보 조회 시도");
      const response = await axiosInstance.get('/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 && response.data) {
        console.log("💡 사용자 정보 조회 성공:", response.data);
        return response.data;
      }
      
      console.error("💡 사용자 정보 조회 실패:", response.status);
      return null;
    } catch (error) {
      console.error("💡 사용자 정보 조회 중 오류:", error);
      return null;
    }
  };

  const handleLogin = async () => {
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
      setIsLoading(true);
      setErrorMessage("");
      
      // axiosInstance를 사용하여 로그인 요청
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
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
      
      // 토큰 설정 (로컬 스토리지 저장 및 헤더 설정)
      setAuthToken(token);
      
      // 토큰으로 사용자 상세 정보 조회
      const userDetails = await fetchUserInfo(token);
      
      // 사용자 정보 구성 - 백엔드에서 받은 정보 우선, 없으면 로그인 응답 사용
      const userInfo = {
        userId: userDetails?.id || userId,
        email: userDetails?.email || email,
        fullName: userDetails?.fullName || fullName || email.split('@')[0],
        role: userDetails?.role || role || userType || "GUEST",
        name: userDetails?.name
      };
      
      console.log("✅ 최종 사용자 정보:", userInfo);
      setUserInfo(userInfo);
      
      // 역할에 따른 라우팅 분기
      if (userInfo.role.toUpperCase() === "OWNER") {
        navigate("/ownermain");
      } else if (["WORKER", "EMPLOYEE"].includes(userInfo.role.toUpperCase())) {
        navigate("/employeemain");
      } else {
        navigate("/defaultMain");
      }
    } catch (error) {
      console.error("🚨 로그인 요청 실패:", error);
      setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY;

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 리다이렉트
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || "http://localhost:5174/auth/kakao/callback";
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${SERVICE_KEY}&redirect_uri=${redirectUri}&response_type=code`;
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className={styles.fontStyle}>비밀번호를 잃어버리셨나요?</div>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          <div style={{ marginTop: "40px" }}>
            <button 
              className={styles.button} 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "Login"}
            </button>
            <p className={styles.fontStyle} style={{ textAlign: "center" }}>
              or
            </p>
            <button
              className={styles.button}
              style={{ backgroundColor: "yellow", color: "black" }}
              onClick={handleKakaoLogin}
              disabled={isLoading}
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
