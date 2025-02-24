import styles from "./AlarmModal.module.css";
import { useState } from "react";
import Button from "../Button";

interface AlarmProps {
  onClose: () => void;
}

interface Alarm {
  requester: string;
  date: string;
  accepter: string;
}

const AlarmModal: React.FC<AlarmProps> = ({ onClose }) => {
  // 알람 데이터를 상태로 관리
  const [alarmData, setAlarmData] = useState<Alarm[]>([
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
  ]);

  // 거절하기 버튼 클릭 시 알람 삭제
  const handleReject = (index: number) => {
    setAlarmData((prev) => prev.filter((_, i) => i !== index)); // 해당 알람을 삭제
  };

  // 수락하기 버튼 클릭 시 새로운 알람 데이터 추가
  const handleAccept = (index: number) => {
    const acceptedAlarm = alarmData[index];
    // 여기서는 예시로 알람 데이터를 새롭게 추가하는 로직
    // 실제 구현에 맞게 스케줄에 추가하는 등의 로직을 넣을 수 있음
    console.log(`수락한 알람:`, acceptedAlarm);
    // 추가적인 동작이 필요하다면 여기에 추가 가능
    setAlarmData((prev) => prev.filter((_, i) => i !== index)); // 알람을 수락 후 삭제
  };

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
                  <span style={{ fontWeight: "700" }}>{alarm.requester}</span>
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
                    onClick={() => handleReject(index)}
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
