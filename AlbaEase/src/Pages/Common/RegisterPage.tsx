import styles from "./RegisterPage.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const RegisterPage = () => {
  // 회원가입 과정에서 사용하는 라디오, 이름, 전화번호, 인증번호, 아이디, 비밀번호, 비밀번호 확인
  const [isRadioSelect, setIsRadioSelect] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");

  // input 박스 내용 바꾸는 함수
  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRadioSelect(e.target.checked);
  };
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  const handleId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  };

  // 유효성 검사 함수
  // 매번 스탭마다 검사해야하는 유효한 함수들이 다르다.
  const isFormValid = () => {
    switch (step) {
      case 1:
        return isRadioSelect; // 라디오 버튼 체크 유무
      case 2:
        const isNameValid = userName.length >= 2 && userName.length <= 5; // 이름은 2~5글자
        const isPhoneValid = phoneNumber.length === 11; // 전화번호는 11자리
        return isNameValid && isPhoneValid; // 이름과 전화번호 모두 유효성 검사

        return code !== ""; // 인증번호 기입 유무
      case 4:
        return id !== "" && password !== "" && passwordCheck !== ""; // 아이디, 비밀번호, 비밀번호 확인
      case 5:
        return isRadioSelect; // 라디오 버튼 체크 유무
      default:
        return false;
    }
  };

  // 회원가입 절차를 step으로 상태변수 관리 1페이지부터 시작이라서 초기값 1로 설정
  const [step, setStep] = useState<number>(1);

  // 각각 유효성을 통과할 시 다음페이지로 넘어갈 수 있도록 설정
  const handleNext = () => {
    if (isFormValid()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  // alert로 알람창이 뜨고 있는데 -> 모달창 또는 효과로 고쳐 나가기

  return (
    <div className={styles.registerPage}>
      <div className={styles.content}>
        <div className={styles.contentPosition}>
          <div style={{ fontSize: "50px" }}>
            Sign Up to
            <div style={{ fontSize: "35px" }}>AlbaEase</div>
          </div>
          <div className={styles.content2}>
            <div>
              이미 알바이즈 계정이 있으시다면
              <br />
              <Link to="../login">여기를 클릭</Link>해 로그인 하세요!
            </div>
            <div>
              <img src="src/assets/AlbaEase_model.png" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.registerForm}>
          {/* 스텝 1 */}
          {step === 1 && (
            <>
              <div style={{ fontSize: "30px" }}>Sign up</div>
              <div className={styles.registerText}>
                알바이즈 가입을 위헤
                <br />
                카카오 가입 시에도 꼭 선택해 주세요!
              </div>
              <div className={styles.radioSelect}>
                <div>
                  <input
                    className={styles.input}
                    type="radio"
                    name="role"
                    id="owner"
                    onChange={handleRadio}
                  />
                  사장님
                </div>
                <div>
                  <input
                    className={styles.input}
                    type="radio"
                    name="role"
                    id="employee"
                    onChange={handleRadio}
                  />
                  알바생
                </div>
              </div>
              <div className={styles.registerText} style={{ fontSize: "22px" }}>
                ----- 가입 방법 선택 -----
              </div>
              <div style={{ marginTop: "40px" }}>
                <button
                  onClick={handleNext}
                  className={`${styles.button} ${
                    isFormValid() ? styles.active : styles.disabled
                  }`}
                  disabled={!isFormValid()}
                >
                  알바이즈에 가입하기
                </button>
                <p className={styles.fontStyle} style={{ textAlign: "center" }}>
                  or
                </p>
                <button style={{ backgroundColor: "yellow", color: "black" }}>
                  카카오로 가입하기
                </button>
              </div>
            </>
          )}

          {/* 스텝 2 */}
          {step === 2 && (
            <>
              <div style={{ fontSize: "30px" }}>Sign up</div>
              <div>
                <input
                  type="text"
                  placeholder="이름"
                  value={userName}
                  onChange={handleName}
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="전화번호"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                />
              </div>
              <button
                style={{ marginTop: "40px" }}
                className={`${styles.button} ${
                  isFormValid() ? styles.active : styles.disabled
                }`}
                onClick={handleNext}
                disabled={!isFormValid()} // isFormValid 함수에 따라 버튼 비활성화
              >
                인증번호 발급 받기
              </button>
            </>
          )}

          {/* 스텝 3 */}
          {step === 3 && (
            <>
              <div style={{ fontSize: "30px" }}>Sign up</div>
              <div>
                <input
                  type="text"
                  placeholder="이름"
                  value={userName}
                  onChange={handleName}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="전화번호"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="인증번호"
                  value={code}
                  onChange={handleCode}
                />
              </div>
              <button
                style={{ marginTop: "40px" }}
                className={`${styles.button} ${
                  isFormValid() ? styles.active : styles.disabled
                }`}
                onClick={handleNext}
                disabled={!isFormValid()}
              >
                인증번호 확인
              </button>
              <div className={styles.fontStyle} style={{ textAlign: "center" }}>
                인증번호 재전송
              </div>
            </>
          )}

          {/* 스탭 4 */}
          {step === 4 && (
            <>
              <div style={{ fontSize: "30px" }}>Sign up</div>
              <div>
                <input
                  type="text"
                  placeholder="이름"
                  value={userName}
                  onChange={handleName}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="전화번호"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                />
              </div>
              <div
                className={styles.fontStyle}
                style={{ textAlign: "left", marginTop: "5px" }}
              >
                전화번호 인증완료
              </div>
              {/* 중복확인을 할 수 있는 내용을 추가해야함 */}
              <div>
                <input
                  type="text"
                  placeholder="아이디"
                  value={id}
                  onChange={handleId}
                />
              </div>
              {/* '아이디'는 사용이 가능합니다. -> 중복확인(버튼)을 클릭했을 때 아래에 나올 수 있도록*/}
              <div>
                {/* 비밀번호 확인할 수 있는 기능 구현하기 */}
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePassword}
                />
              </div>
              <div>
                {/* 비밀번호 확인할 수 있는 기능 구현하기 */}
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChange={handlePasswordCheck}
                />
              </div>
              {/* 비밀번호가 틀립니다., 비밀번호가 일치합니다. -> 조건에 따라서 텍스트가 나올 수 있도록 구현 */}
              <button
                style={{ marginTop: "40px" }}
                className={`${styles.button} ${
                  isFormValid() ? styles.active : styles.disabled
                }`}
                onClick={handleNext}
                disabled={!isFormValid()}
              >
                알바이즈 가입하기
              </button>
            </>
          )}

          {/* 스탭 5 */}
          {step === 5 && (
            <>
              <div style={{ fontSize: "30px" }}>Sign up</div>
              약관 사항을 넣어야함
              <button style={{ marginTop: "40px" }} onClick={handleNext}>
                동의하고 가입하기
              </button>
            </>
          )}

          {/* 스탭 6, 7 선택사항인데 까다롭다. 조건을 라디오 박스에다가 넣어야 하는 건가. */}
          {/* 스탭 6 */}
          {step === 6 && (
            <>
              <div style={{ fontSize: "30px" }}>매장 등록하기(선택)</div>
              <input
                type="password"
                placeholder="매장의 사업자 번호를 입력해 주세요"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

// 각 상태에다가 조건 부여하기 -> 글자수, 전화번호 등등 형식에 맞는지
// 조건에 맞지 않을 경우 -> 오류 메세지 넣을 수 있도록 구현
// 유효성 검사하기 -> ex) 다음 스텝으로 넘어갈 때 버튼이 input을 다 채워야지만 활성화 할 수 있도록 구현

// 코드가 길어져 step별로 컴포넌트 나눌예정
// 급한 거 없으니 나중에 구현하고 해보기
