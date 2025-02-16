import styles from "./RegisterPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";
import axios from "axios";

const RegisterPage = () => {
  // 회원가입 과정에서 사용하는 라디오, 이름, 전화번호, 인증번호, 아이디, 비밀번호, 비밀번호 확인
  const [isRadioSelect, setIsRadioSelect] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");

  // input 박스 내용 바꾸는 함수
  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRadioSelect(e.target.checked);
  };
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
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
  // 매번 스탭마다 검사해야하는 유효한 조건들이 다르다.
  // 이름: 한글만 사용 2글자 ~ 5글자 (이게 일단 통신사 가입할 때 이름을 어떻게 정하는 지 알아봐야할 거 같다.)
  // 전화번호: 숫자만 이용해서 11자리
  // 인증번호 6자리로 임의로 정함
  // 아이디: 조건 정해야함
  // 비밀번호: 조건 정해야함
  // 비밀번호 확인: 위의 비밀번호와 동일하다는 내용이 들어가야함

  const isFormValid = () => {
    switch (step) {
      case 1:
        return isRadioSelect; // 라디오 버튼 체크 유무
      case 2:
        const isLastNameValid = lastName.length >= 1 && lastName.length <= 2; // 성은 1~2글자
        const isFirstNameValid = firstName.length >= 2 && firstName.length <= 5; // 이름은 2~5글자
        const isPhoneValid = phoneNumber.length === 11; // 전화번호는 11자리
        return isFirstNameValid && isLastNameValid && isPhoneValid; // 이름과 전화번호 모두 유효성 검사
      case 3:
        const isCodeValid = code.length === 6; // 6자리 숫자가 국룰인 거 같아서 다음과 같이 설정
        return isCodeValid; // 인증번호 기입 유무
      case 4:
        const isIdValid = id.length >= 8;
        const isPasswordValid = password.length >= 8;
        const isPasswordCheckValid = password === passwordCheck;
        return isIdValid && isPasswordValid && isPasswordCheckValid; // 아이디, 비밀번호, 비밀번호 확인
      case 5:
        // 필수 선택사항 체크박스가 선택되었을 때 버튼이 활성화 될 수 있도록
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

  // 회원가입 절차를 step으로 상태변수 관리 1페이지부터 시작이라서 초기값 1로 설정
  const [step, setStep] = useState<number>(1);

  // 각각 유효성을 통과할 시 다음페이지로 넘어갈 수 있도록 설정
  const handleNext = () => {
    if (isFormValid()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const navigate = useNavigate();

  const handleMain = () => {
    navigate("../ownermain");
  };

  // 회원가입 선택지 select checkbox 만들기
  // 전체 선택버튼으로 이 버튼을 누르면 필수 + 선택을 전부다 누를 수 있게된다.

  // 필수 항목을 만들었다. 이 필수 항목이 선택되어야만 버튼을 활성화 시킬 수 있도록 이름을 만들어준다.
  const [requiredCheckBox, setRequiredCheckBox] = useState({
    termsOfService: false, // 알바이즈 이용약관
    personalInfo: false, // 개인정보
    thirdPartyInfo: false, // 개인정보 제3자 제공동의
  });

  // 필수 항목 핸들러 함수
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRequiredCheckBox((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 전화번호 입력 후 사용자가 백엔드로부터 인증번호를 받는 과정
  // 전화번호(프론트) -> 전화번호를 받고(백엔드) -> 인증번호를 보내준다(사용자한테)
  const handleRequestVerificationCode = async () => {
    try {
      console.log("전화번호:", phoneNumber); // 디버깅용 로그
      const response = await axios.post(
        "http://3.39.237.218:8080/user/send-sms",
        {
          phoneNumber,
        }
      );

      alert(response.data.message || "인증번호가 발송되었습니다!");

      // 인증번호 발송 후 다음 단계로 넘어가려면 handleNext 실행
      handleNext();
    } catch (error) {
      alert("인증번호 요청 중 오류가 발생했습니다.");
    }
  };

  // 전화번호랑 인증코드를 인증해서 다음 단계로 넘어가기
  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        "http://3.39.237.218:8080/user/verify-sms",
        {
          verficationCode: code, // 백엔드 이름 맞춰주기
        }
      );

      if (response.data.success) {
        alert("인증이 완료되었습니다!");
        handleNext();
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("인증번호 확인 중 오류가 발생했습니다.");
    }
  };

  const [idError, setIdError] = useState<string>("");
  // 아이디 중복확인 버튼
  const handleIdCheck = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/user/check-email",
        {
          id,
        }
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

  const handleRegister = async () => {
    try {
      const userData = {
        lastName, // 성
        firstName, // 이름
        phoneNumber, // 전화번호
        id, // 아이디
        password, // 비밀번호
      };

      const response = await axios.post(
        "http://localhost:8081/user/signup",
        userData
      );

      if (response.data.success) {
        alert("가입이 완료되었습니다!");
        handleNext();
      } else {
        alert("가입 실패: " + response.data.message);
      }
    } catch (error) {
      alert("가입 중 오류가 발생했습니다.");
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
                    className={styles.inputRadio}
                    type="radio"
                    name="role"
                    id="owner"
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
                  type="tel"
                  placeholder="전화번호"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  className={styles.input}
                />
              </div>
              <button
                style={{ marginTop: "40px" }}
                className={`${styles.button} ${
                  isFormValid() ? styles.active : styles.disabled
                }`}
                onClick={handleRequestVerificationCode}
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
                  type="text"
                  placeholder="전화번호"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
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
                  value={firstName}
                  onChange={handleFirstName}
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="전화번호"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  className={styles.input}
                />
              </div>
              <div
                className={styles.fontStyle}
                style={{ textAlign: "left", marginTop: "5px" }}
              >
                전화번호 인증완료
              </div>
              {/* 중복확인을 할 수 있는 내용을 추가해야함 */}
              <div className={styles.wrapper}>
                <input
                  type="text"
                  placeholder="아이디"
                  value={id}
                  onChange={handleId}
                  className={styles.input}
                  style={{ paddingRight: "90px" }}
                />
                <button className={styles.checkButton} onClick={handleIdCheck}>
                  중복확인
                </button>
              </div>
              {idError && <div className={styles.errorMessage}>{idError}</div>}
              {/* '아이디'는 사용이 가능합니다. -> 중복확인(버튼)을 클릭했을 때 아래에 나올 수 있도록*/}
              <div>
                {/* 비밀번호 확인할 수 있는 기능 구현하기 */}
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePassword}
                  className={styles.input}
                />
              </div>
              <div>
                {/* 비밀번호 확인할 수 있는 기능 구현하기 */}
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChange={handlePasswordCheck}
                  className={styles.input}
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
                      // 핸들러 함수를 통해 상태가 업데이트되고, checked 속성에 새로운 값이 반영된다. 아래 2개도 동일한 컨셉
                      // 초기값은 false 선택 후 -> true
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
                onClick={handleNext}
                disabled={!isFormValid()}
              >
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
