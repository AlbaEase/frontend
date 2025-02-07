import styles from "./MyInformation.module.css";
import { useState } from "react";

const MyInformation = () => {
  const [name, setname] = useState<string>("홍길동");
  const [phone, setPhone] = useState<string>("010-1234-5678");
  const [password, setPassword] = useState<string>("********");
  const [job, setJob] = useState<string>("사장님");
  const [place, setPlace] = useState<string>("GS25, 하노이맥주병거리");

  const openModal = () => {};

  return (
    <div className={styles.MyInformation}>
      <div
        className={styles.contentContainer}
        style={{ borderBottom: "1px black solid" }}
      >
        <div className={styles.title}>나의 정보</div>
        <div className={styles.content} onClick={openModal}>
          정보수정하기
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>이름</div>
        <div className={styles.content}>{name}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>휴대폰 번호</div>
        <div className={styles.content}>{phone}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>비밀번호</div>
        <div className={styles.content}>{password}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>직업</div>
        <div className={styles.content}>{job}</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>근무 매장</div>
        <div className={styles.contentPlace}>{place}</div>
      </div>
    </div>
  );
};

export default MyInformation;
