import { useState, useEffect } from "react";
import styles from "./AlarmModal.module.css";
import Button from "../Button";
import { 
  fetchNotifications, 
  deleteNotification, 
  updateModificationStatus, 
  updateShiftStatus 
} from "../../api/apiService";

interface AlarmProps {
  onClose: () => void;
}

// 백엔드 응답 구조에 맞게 알림 인터페이스 정의
interface Notification {
  id: number;
  type: 'SPECIFIC_USER' | 'ALL_USERS';
  readStatus: 'READ' | 'UNREAD';
  message: string;
  createdAt: string;
  
  // 대타 요청 관련 필드
  fromUserId?: number;
  toUserId?: number; 
  shiftStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  
  // 수정 요청 관련 필드
  details?: string;
  modificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  
  // 추가 필드
  scheduleId?: number;
}

const AlarmModal: React.FC<AlarmProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 알림 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchNotifications();
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setError("알림 데이터 형식이 잘못되었습니다.");
        }
      } catch (err) {
        setError("알림을 가져오는 중 오류가 발생했습니다.");
        console.error("알림 가져오기 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 알림 수락 처리
  const handleAccept = async (notification: Notification) => {
    try {
      if (notification.modificationStatus !== undefined) {
        // 근무 수정 요청 승인
        await updateModificationStatus(notification.id, 'APPROVED');
      } else if (notification.shiftStatus !== undefined) {
        // 근무 교대 요청 승인
        await updateShiftStatus(notification.id, 'APPROVED');
      }
      
      // 알림 삭제
      await deleteNotification(notification.id);
      
      // 화면에서 알림 제거
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
    } catch (err) {
      console.error("알림 수락 처리 중 오류:", err);
      setError("요청을 처리하는 중 오류가 발생했습니다.");
    }
  };

  // 알림 거절 처리
  const handleReject = async (notification: Notification) => {
    try {
      if (notification.modificationStatus !== undefined) {
        // 근무 수정 요청 거절
        await updateModificationStatus(notification.id, 'REJECTED');
      } else if (notification.shiftStatus !== undefined) {
        // 근무 교대 요청 거절
        await updateShiftStatus(notification.id, 'REJECTED');
      }
      
      // 알림 삭제
      await deleteNotification(notification.id);
      
      // 화면에서 알림 제거
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
    } catch (err) {
      console.error("알림 거절 처리 중 오류:", err);
      setError("요청을 처리하는 중 오류가 발생했습니다.");
    }
  };

  // 알림 형식에 따른 메시지 렌더링
  const renderNotificationMessage = (notification: Notification) => {
    // 수정 요청인 경우
    if (notification.modificationStatus !== undefined) {
      return (
        <div className={styles.alarmContent}>
          <div>
            <span style={{ fontWeight: "700" }}>근무 수정 요청</span>
          </div>
          <div>{new Date(notification.createdAt).toLocaleString()}</div>
          <div>{notification.message}</div>
          {notification.details && <div>요청 내용: {notification.details}</div>}
        </div>
      );
    }
    
    // 대타 요청인 경우
    if (notification.shiftStatus !== undefined) {
      return (
        <div className={styles.alarmContent}>
          <div>
            <span style={{ fontWeight: "700" }}>대타 요청</span>
          </div>
          <div>{new Date(notification.createdAt).toLocaleString()}</div>
          <div>{notification.message}</div>
        </div>
      );
    }
    
    // 일반 알림인 경우
    return (
      <div className={styles.alarmContent}>
        <div>{notification.message}</div>
        <div>{new Date(notification.createdAt).toLocaleString()}</div>
      </div>
    );
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
          {error && (
            <p className={styles.errorMessage}>{error}</p>
          )}
          
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>알림을 불러오는 중...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className={styles.contentBox}>
                {renderNotificationMessage(notification)}
                
                {/* 승인/거절이 필요한 알림인 경우에만 버튼 표시 */}
                {(notification.modificationStatus === 'PENDING' || notification.shiftStatus === 'PENDING') && (
                  <div className={styles.alarmButton}>
                    <Button
                      width="105px"
                      height="35px"
                      onClick={() => handleAccept(notification)}
                    >
                      수락하기
                    </Button>
                    <Button
                      width="105px"
                      height="35px"
                      variant="gray"
                      onClick={() => handleReject(notification)}
                    >
                      거절하기
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", padding: "20px" }}>
              새로운 알림이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
