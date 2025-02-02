import "./LandingPage.css";
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <>
      <p>
        <Link to="../login">여기를 클릭</Link>해 로그인 하세요!
      </p>
      <Link to="../register">여기를 클릭</Link>해 회원가입 하세요!!
    </>
  );
};

export default LandingPage;
