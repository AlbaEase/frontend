import styles from "./LoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const handleLogin = () => {
    if (id.trim() && password.trim()) {
      try {
        // api연동구간
        navigate("/main");
      } catch (error) {
        alert("로그인 실패: 다시 시도해주세요.");
      }
    } else {
      alert("아이디와 비밀번호를 입력해주세요.");
    }
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
              <img src="src/assets/AlbaEase_model.png" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.loginForm}>
          <div style={{ fontSize: "30px" }}>Sign in</div>
          <div>
            <input
              type="text"
              value={id}
              onChange={handleId}
              placeholder="ID"
            />
          </div>
          <div>
            {/* 비밀번호 확인할 수 있는 기능 구현하기 */}
            <input
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="Password"
            />
          </div>
          <div className={styles.fontStyle}>비밀번호를 잃어버리셨나요?</div>
          <div style={{ marginTop: "40px" }}>
            <button onClick={handleLogin}>Login</button>
            <p className="fontStyle" style={{ textAlign: "center" }}>
              or
            </p>
            <button style={{ backgroundColor: "yellow", color: "black" }}>
              카카오 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// 1. 위에 헤더가 만들어지는 대로 추가해서 넣기
// 2. 글꼴 확인한 후 변경하기
// 3. loginForm 색상 변경하기 -> 정확하게 넣지 못함 일단 비슷하게 임의로 넣었는데 다음과 같이 넣어도 되는건지 잘 모르겠음
// 4. 현재 html, css 작업만 한 상태 앞으로 타입스크립로 문법 짜서 넣기

//  - 아이디랑 비밀번호 조건이 어떻게 되는지
//  조건을 정해야 할 거 같다.
