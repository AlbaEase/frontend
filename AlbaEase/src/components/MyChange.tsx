import styles from "./MyChange.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

const MyChange = () => {
  interface RequestData {
    date: string;
    requester: string;
    accepter: string;
  }

  // 기본값: 승인 내역, 변경을 통해서 거절내용과 왔다갔다 할 수 있도록
  const [changeTab, setChangeTab] = useState("approved");

  // const [approvedRequests, setApprovedRequests] = useState<RequestData[]>([]);
  // const [rejectedRequests, setRejectedRequests] = useState<RequestData[]>([]);

  const [date, setDate] = useState<string>("25.01.15/18:00~23:00");
  const [requester, setRequester] = useState<string>("이서영");
  const [accepter, setAccepter] = useState<string>("김시현");

  // 날짜, 요청한 사람, 수락한사람 각각 백엔드에서 받아오기
  // 현재 데이터는 로컬에서 확인해보기 위해서 내가 임의로 데이터를 받아 온거고 나중에 연동하면 사용하게 될 코드 아래 주석으로 처리
  const approvedRequests = [
    { date: "25.01.17/18:00~23:00", requester: "김시현", accepter: "이은우" },
    { date: "25.01.14/18:00~23:00", requester: "조정현", accepter: "조유성" },
    { date: "25.01.15/18:00~23:00", requester: "조유성", accepter: "김가윤" },
    { date: "25.01.05/18:00~23:00", requester: "김지희", accepter: "이서영" },
  ];

  const rejectedRequests = [
    { date: "25.01.15/18:00~23:00", requester: "조유성", accepter: "김가윤" },
    { date: "25.01.12/18:00~23:00", requester: "김지희", accepter: "이서영" },
    { date: "25.01.10/18:00~23:00", requester: "이은우", accepter: "조유성" },
    { date: "25.01.08/18:00~23:00", requester: "김시현", accepter: "조정현" },
    { date: "25.01.06/18:00~23:00", requester: "이서영", accepter: "조유성" },
  ];

  // useEffect(() => {
  //   // 백엔드에서 승인/거절 내역 가져오기
  //   const fetchRequests = async () => {
  //     try {
  //       const approvedRes = await axios.get("/api/requests/approved");
  //       const rejectedRes = await axios.get("/api/requests/rejected");

  //       setApprovedRequests(approvedRes.data);
  //       setRejectedRequests(rejectedRes.data);
  //     } catch (error) {
  //       console.error("데이터 가져오기 실패:", error);
  //     }
  //   };

  //   fetchRequests();
  // }, []); // 페이지가 처음 렌더링될 때 실행

  return (
    <div className={styles.MyChange}>
      <div className={styles.contentContainer}>
        <div className={styles.title}>근무변경 요청내용</div>
        <div className={styles.content}>
          <span
            className={`${styles.button} ${
              changeTab === "approved" ? styles.activeButton : ""
            }`}
            onClick={() => {
              setChangeTab("approved");
            }}
          >
            승인 내역
          </span>
          <span>ㅣ</span>
          <span
            className={`${styles.button} ${
              changeTab === "rejected" ? styles.activeButton : ""
            }`}
            onClick={() => {
              setChangeTab("rejected");
            }}
          >
            거절 내역
          </span>
        </div>
      </div>
      <div className={styles.content2Container}>
        <div className={styles.title2}>근무일자</div>
        <div className={styles.content2} style={{ textAlign: "center" }}>
          요청자
        </div>
        <div className={styles.content2}>대체근무자</div>
      </div>
      <div>
        {(changeTab === "approved" ? approvedRequests : rejectedRequests).map(
          (item, index) => (
            <div key={index} className={styles.content3Container}>
              <div className={styles.title3}>{item.date}</div>
              <div className={styles.content3}>{item.requester}</div>
              <div className={styles.content3}>{item.accepter}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyChange;
