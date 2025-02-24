import styles from "./AlarmModal.module.css";
import { useState } from "react";
import Button from "../Button";

interface AlarmProps {
  onClose: () => void;
}

const AlarmModal: React.FC<AlarmProps> = ({ onClose }) => {
  const [date, setDate] = useState<string>("25.01.15/18:00~23:00");
  const [requester, setRequester] = useState<string>("이서영");
  const [accepter, setAccepter] = useState<string>("김시현");

  // 하드코딩 내용들
  const alarmData = [
    {
      requester: "김가윤",
      date: "25.01.15/18:00~23:00",
      accepter: "이서영",
    },
    {
      requester: "조정현",
      date: "25.01.12/18:00~23:00",
      accepter: "조유성",
    },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>알림</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.content}>
          {alarmData.map((alarm, index) => (
            <div key={index} className={styles.contentBox}>
              <div className={styles.alarmContent}>
                <div>
                  <span style={{ fontWeight: "700" }}>{alarm.requester}</span>{" "}
                  님의 근무 변경 요청이 있어요.
                </div>
                <div>{alarm.date}</div>
                <div>요청 대상자: {alarm.accepter}</div>
              </div>
              <div className={styles.alarmButton}>
                <div>
                  <Button width="105px" height="35px" children="수락하기" />
                </div>
                <div>
                  <Button
                    width="105px"
                    height="35px"
                    variant="gray"
                    children="거절하기"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
