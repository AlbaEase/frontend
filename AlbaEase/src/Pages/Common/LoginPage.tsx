import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="loginPage">
      <div className="content">
        <div className="contentPosition">
          <div style={{ fontSize: "50px" }}>
            Sign in to
            <div style={{ fontSize: "35px" }}>AlbaEase</div>
          </div>
          <div className="content-2">
            <div>
              만약, 알바이즈에 가입되어 있지 않으시다면
              <br />
              <a>여기를 클릭</a>해 회원가입 하세요!!
            </div>
            <div>
              <img src="src/assets/AlbaEase_model.png" />
            </div>
          </div>
        </div>
      </div>
      <div className="form">
        <div className="loginForm">
          <div style={{ fontSize: "30px" }}>Sign in</div>
          <div>
            <input className="forms" type="email" placeholder="ID" />
          </div>
          <div>
            <input type="password" placeholder="Password" />
          </div>
          <div className="fontStyle">비밀번호를 잃어버리셨나요?</div>
          <div style={{ marginTop: "40px" }}>
            <button>Login</button>
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
