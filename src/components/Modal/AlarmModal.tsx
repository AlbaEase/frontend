import { useState, useEffect, useRef } from "react";
import styles from "./AlarmModal.module.css";
import Button from "../Button";
import { fetchNotifications } from "../../api/apiService";

interface AlarmProps {
  onClose: () => void;
}

interface Notification {
  id: number;
  requester: string; // 요청한 사람
  accepter: string; // 변경 대상자
  date: string; // 변경 요청 날짜
}

const AlarmModal: React.FC<AlarmProps> = ({ onClose }) => {
  const [alarmData, setAlarmData] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNotifications();
      if (data) {
        setAlarmData(data);
      }
    };

    fetchData(); //
  }, []);

  // ✅ 알람 수락하기
  const handleAccept = (id: number) => {
    console.log(`✅ 알람 수락: ${id}`);
    setAlarmData((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  // ✅ 알람 거절하기
  const handleReject = (id: number) => {
    console.log(`❌ 알람 거절: ${id}`);
    setAlarmData((prev) => prev.filter((alarm) => alarm.id !== id));
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
          {alarmData.length > 0 ? (
            alarmData.map((alarm) => (
              <div key={alarm.id} className={styles.contentBox}>
                <div className={styles.alarmContent}>
                  <div>
                    <span style={{ fontWeight: "700" }}>{alarm.requester}</span>
                    님의 근무 변경 요청이 있어요.
                  </div>
                  <div>{alarm.date}</div>
                  <div>요청 대상자: {alarm.accepter}</div>
                </div>
                <div className={styles.alarmButton}>
                  <Button
                    width="105px"
                    height="35px"
                    onClick={() => handleAccept(alarm.id)}
                  >
                    수락하기
                  </Button>
                  <Button
                    width="105px"
                    height="35px"
                    variant="gray"
                    onClick={() => handleReject(alarm.id)}
                  >
                    거절하기
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", padding: "20px" }}>
              새로운 알람이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
