import styles from "./RegisterPage.module.css";
import albaBoy from "../../assets/albaBoy.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";
import axiosInstance from "../../api/axios"; // ✅ axios 설정 파일
import { AxiosError } from "axios"; // 이 줄을 최상단 import 구문에 추가
// choalba1!

const RegisterPage = () => {
  const [role, setRole] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  // const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  // const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  // 라디오 버튼 핸들러
  const handleRadio = (e: ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };

  // 각각의 input 핸들러
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  // const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPhoneNumber(e.target.value);
  // };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  // const handleId = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setId(e.target.value);
  // };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  };

  // step별 유효성 검사
  const [step, setStep] = useState<number>(1);

  const isFormValid = () => {
    switch (step) {
      case 1:
        return role !== "";
      case 2:
        const isFirstNameValid = firstName.length >= 1 && firstName.length <= 5; // ✨ 이름 유효성 추가
        const isLastNameValid = lastName.length >= 1 && lastName.length <= 2;
        const isemailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        );
        return isFirstNameValid && isLastNameValid && isemailValid;

      case 3:
        const isCodeValid = code.length === 6;
        return isCodeValid;
      case 4:
        // const isIdValid = id.length >= 8;
 
        const isPasswordValid = password.length >= 8;
        const isPasswordCheckValid = password === passwordCheck;
        return   isPasswordValid && isPasswordCheckValid;
      case 5:
        return (
          requiredCheckBox.termsOfService &&
          requiredCheckBox.personalInfo &&
          requiredCheckBox.thirdPartyInfo
        );
      case 6:
        return false;
      default:
        return false;
    }
  };

  const handleLogin = () => {
    navigate("../login"); // 로그인 페이지로 이동
  };

  const handleNext = () => {
    if (isFormValid()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const navigate = useNavigate();

  // const handleMain = () => {
  //   navigate("../ownermain");
  // };

  // 약관 동의 체크박스
  const [requiredCheckBox, setRequiredCheckBox] = useState({
    termsOfService: false,
    personalInfo: false,
    thirdPartyInfo: false,
  });

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRequiredCheckBox((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 인증번호 발급
  const handleRequestVerificationCode = async () => {
    try {
      console.log("요청 데이터:", { email });
      const response = await axiosInstance.post(
        "/user/send-mail",
        { email }
        // { withCredentials: true }
      );
      console.log("응답 데이터:", response.data);
      alert(response.data.message || "인증번호가 발송되었습니다!");
      handleNext();
    } catch (error) {
      console.error("에러 details:", error);
      alert("인증번호 요청 중 오류가 발생했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axiosInstance.post(
        "/user/verify-mail",
        { email, verificationCode: code },
        // { withCredentials: true }
      );
      if (response.status === 200) {
        setIsEmailVerified(true);
        alert("인증이 완료되었습니다!");
        handleNext();
      } else {
        alert("인증에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("인증 에러:", error.response?.data);
      alert(
        error.response?.data?.message || "인증번호 확인 중 오류가 발생했습니다."
      );
    }
  };
  // 아이디 중복 확인
  const [idError, setIdError] = useState<string>("");

  const handleIdCheck = async () => {
    try {
      const response = await axiosInstance.post(
        "/user/check-id",
        { email },
        { withCredentials: true }
      );
      if (response.data.isDuplicate) {
        setIdError("이미 사용 중인 아이디입니다.");
      } else {
        setIdError("사용 가능한 아이디입니다!");
      }
    } catch (error) {
      setIdError("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  // 최종 회원가입
  const handleRegister = async () => {
    try {
      if (!isEmailVerified) {
        alert("이메일 인증을 먼저 완료해주세요.");
        return;
      }

      const userData = {
        socialType: "NONE",
        lastName,
        firstName,
        email,
        password,
        confirmPassword: passwordCheck,
        // phoneNumber,
        // email,
        role,
        // isEmailVerified,
      };

      console.log("전송 데이터:", userData);
      const response = await axiosInstance.post("/user/signup", userData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("가입이 완료되었습니다!");
        handleLogin();
      }
    } catch (error: any) {
      console.error("에러 응답:", error.response?.data);
      alert(error.response?.data?.message || "가입 중 오류가 발생했습니다.");
    }
  };
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
              <img src={albaBoy} alt="albaBoy" className={styles.img} />
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
                알바이즈 가입을 위해
                <br />
                카카오 가입 시에도 꼭 선택해 주세요!
              </div>
              <div className={styles.radioSelect}>
                <div>
                  <input
                    className={styles.inputRadio}
                    type="radio"
                    name="role"
                    id="owner"
                    value="OWNER"
                    onChange={handleRadio}
                  />
                  <label htmlFor="owner">사장님</label>
                </div>
                <div>
                  <input
                    className={styles.inputRadio}
                    type="radio"
                    name="role"
                    id="employee"
                    value="WORKER"
                    onChange={handleRadio}
                  />
                  <label htmlFor="employee">알바생</label>
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
                <button
                  className={styles.button}
                  style={{ backgroundColor: "yellow", color: "black" }}
                >
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
                  placeholder="성"
                  value={lastName}
                  onChange={handleLastName}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="이름"
                  value={firstName}
                  onChange={handleFirstName}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={handleEmail}
                  className={styles.input}
                />
              </div>
              <button
                style={{ marginTop: "40px" }}
                className={`${styles.button} ${
                  isFormValid() ? styles.active : styles.disabled
                }`}
                onClick={handleRequestVerificationCode}
                disabled={!isFormValid()}
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
                  placeholder="성"
                  value={lastName}
                  onChange={handleLastName}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="이름"
                  value={firstName}
                  onChange={handleFirstName}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="alba@naver.com"
                  value={email}
                  onChange={handleEmail}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="인증번호"
                  value={code}
                  onChange={handleCode}
                  className={styles.input}
                />
              </div>
              <button
                style={{ marginTop: "40px" }}
                className={`${styles.button} ${
                  isFormValid() ? styles.active : styles.disabled
                }`}
                onClick={handleVerifyCode}
                disabled={!isFormValid()}
              >
                인증번호 확인
              </button>
              <div className={styles.fontStyle} style={{ textAlign: "center" }}>
                인증번호 재전송
              </div>
            </>
          )}

          {/* 스텝 4 */}
          {step === 4 && (
            <>
              <div style={{ fontSize: "30px" }}>Sign up</div>
              <div>
                <input
                  type="text"
                  placeholder="이름"
                  value={firstName}
                  onChange={handleFirstName}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={handleEmail}
                  className={styles.input}
                />
              </div>
              <div
                className={styles.fontStyle}
                style={{ textAlign: "left", marginTop: "5px" }}
              >
                이메일 인증완료
              </div>
              <div className={styles.wrapper}>
                <input
                  type="text"
                  placeholder="이메일"
                  value={email}
                  onChange={handleEmail}
                  className={styles.input}
                  style={{ paddingRight: "90px" }}
                />
                <button className={styles.checkButton} onClick={handleIdCheck}>
                  중복확인
                </button>
              </div>
              {idError && <div className={styles.errorMessage}>{idError}</div>}
              <div>
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePassword}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChange={handlePasswordCheck}
                  className={styles.input}
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
                알바이즈 가입하기
              </button>
            </>
          )}

          {/* 스텝 5 */}
          {step === 5 && (
            <>
              <div style={{ fontSize: "30px" }}>Sign up</div>
              <div className={styles.termsBox}>
                <div
                  className={styles.termsTitle}
                  style={{ marginTop: "30px" }}
                >
                  <div>
                    <input type="checkbox" className={styles.checkBox} />
                    모두 확인하였으며 동의합니다.
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      marginLeft: "25px",
                      color: "#6B6B6B",
                    }}
                  >
                    전체 동의에는 필수 및 선택 정보에 대한 동의가 포함되어
                    있습니다.
                    <br /> 개별적으로 동의를 하실 수 있으며,
                    <br /> 선택항목에 대한 동의를 거부하시는 경우에도 서비스
                    이용이 가능합니다.
                  </div>
                </div>
                <div className={styles.termsContent}>
                  <div className={styles.chcekContent}>
                    <input
                      type="checkbox"
                      name="termsOfService"
                      checked={requiredCheckBox.termsOfService}
                      onChange={handleCheckboxChange}
                      className={styles.checkBox}
                    />
                    [필수]알바이즈 이용약관 동의
                  </div>
                  <div className={styles.chcekContent}>
                    <input
                      type="checkbox"
                      name="personalInfo"
                      checked={requiredCheckBox.personalInfo}
                      onChange={handleCheckboxChange}
                      className={styles.checkBox}
                    />
                    [필수]개인정보 수집 및 이용 동의
                  </div>
                  <div className={styles.chcekContent}>
                    <input
                      type="checkbox"
                      name="thirdPartyInfo"
                      checked={requiredCheckBox.thirdPartyInfo}
                      onChange={handleCheckboxChange}
                      className={styles.checkBox}
                    />
                    [필수]개인정보 제3자 제공 동의
                  </div>
                  <div className={styles.chcekContent}>
                    <input type="checkbox" className={styles.checkBox} />
                    [선택]마케팅 목적의 개인정보 수집 및 이용동의
                  </div>
                  <div className={styles.chcekOptionContent}>
                    <input type="checkbox" className={styles.checkBox} />
                    [선택]광고성 수신 정보 선택
                  </div>
                  <div className={styles.chcekOptionContent}>
                    <input type="checkbox" className={styles.checkBox} />
                    [선택]광고성 수신 정보 선택
                  </div>
                  <div className={styles.chcekOptionContent}>
                    <input type="checkbox" className={styles.checkBox} />
                    [선택]광고성 수신 정보 선택
                  </div>
                </div>
              </div>
              <button
                className={`${styles.button} ${
                  isFormValid() ? styles.active : styles.disabled
                }`}
                style={{ marginTop: "40px" }}
                onClick={handleRegister}
                disabled={!isFormValid()}
              >
                동의하고 가입하기
              </button>
            </>
          )}

          {/* 스텝 6 (선택) */}
          {/* {step === 6 && (
            <>
              <div style={{ fontSize: "30px" }}>매장 등록하기(선택)</div>
              <input
                type="password"
                placeholder="매장의 사업자 번호를 입력해 주세요"
                className={styles.input}
              />
              <button
                style={{
                  marginTop: "30px",
                  backgroundColor: "white",
                  color: "#009963",
                }}
                className={styles.button}
              >
                매장 추가하기
              </button>
              <button
                onClick={handleMain}
                className={styles.button}
                style={{ marginTop: "10px" }}
              >
                매장 등록하기
              </button>
              <button
                onClick={handleMain}
                className={styles.button}
                style={{ marginTop: "150px" }}
              >
                매장등록 건너뛰기
              </button>
            </>
          )} */}
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




// 지금 회원가입부터 다시 시작