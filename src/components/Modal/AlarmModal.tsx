import { useState, useEffect } from "react";
import styles from "./AlarmModal.module.css";
import Button from "../Button";
import { 
  fetchNotifications, 
  deleteNotification, 
  updateModificationStatus, 
  updateShiftStatus 
} from "../../api/apiService";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { useOwnerSchedule } from "../../contexts/OwnerScheduleContext";
import { triggerScheduleUpdate } from "../Calendar";

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
  shiftId?: number;
  
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
  const [processingNotification, setProcessingNotification] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // 웹소켓 컨텍스트 사용
  const { lastNotification, markNotificationsRead } = useWebSocket();
  
  // 스케줄 컨텍스트 사용
  const { setOwnerSchedules, selectedStore } = useOwnerSchedule();

  // 알림 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchNotifications();
        console.log("알림 데이터 응답:", data);
        
        if (Array.isArray(data)) {
          setNotifications(data);
          // 알림을 읽음 상태로 표시
          markNotificationsRead();
        } else {
          setError("알림 데이터 형식이 잘못되었습니다.");
          console.error("알림 데이터 형식 오류:", data);
        }
      } catch (err) {
        setError("알림을 가져오는 중 오류가 발생했습니다.");
        console.error("알림 가져오기 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [markNotificationsRead]);

  // 새 알림이 오면 목록 갱신
  useEffect(() => {
    if (lastNotification) {
      // 이미 목록에 있는지 확인
      const exists = notifications.some(notif => notif.id === lastNotification.id);
      
      if (!exists) {
        setNotifications(prev => [lastNotification, ...prev]);
      }
    }
  }, [lastNotification, notifications]);

  // 알림 수락 처리
  const handleAccept = async (notification: Notification) => {
    try {
      setProcessingNotification(notification.id);
      setError(null);
      setSuccessMessage(null);
      
      // 알림 데이터 상세 디버깅 
      console.log("===== 알림 데이터 디버깅 =====");
      console.log(`알림 ID: ${notification.id}`);
      console.log(`알림 타입: ${notification.type}`);
      console.log(`modificationStatus: ${notification.modificationStatus}`);
      console.log(`shiftStatus: ${notification.shiftStatus}`);
      console.log(`scheduleId: ${notification.scheduleId}`);
      console.log(`shiftId: ${notification.shiftId}`);
      console.log(`fromUserId: ${notification.fromUserId}`);
      console.log(`toUserId: ${notification.toUserId}`);
      console.log(`메시지: ${notification.message}`);
      console.log("============================");
      
      let response;
      
      // 근무 수정 요청인지 명확하게 확인 (modificationStatus가 있고 shiftStatus가 없는 경우)
      if (notification.modificationStatus !== undefined && notification.shiftStatus === undefined) {
        console.log("🔄 이 알림은 근무 수정 요청입니다.");
        // 근무 수정 요청 승인
        response = await updateModificationStatus(notification.id, 'APPROVED');
        console.log("근무 수정 요청 승인 응답:", response);
        setSuccessMessage("근무 수정 요청이 승인되었습니다.");
        
        // 스케줄 업데이트 - 수정 요청이 승인된 경우
        if (response && response.scheduleId) {
          await fetchUpdatedSchedules();
          // 스케줄 갱신 이벤트 발생
          if (response.schedule) {
            // Schedule 타입을 ScheduleUpdateDetail 타입으로 변환
            const scheduleUpdateDetail = {
              scheduleId: response.schedule.scheduleId,
              userId: response.schedule.userId,
              userName: response.schedule.userName,
              startTime: response.schedule.startTime,
              endTime: response.schedule.endTime,
              date: response.schedule.workDate
            };
            triggerScheduleUpdate(scheduleUpdateDetail);
            
            // 페이지 새로고침 추가
            setTimeout(() => {
              window.location.reload();
            }, 1500); // 1.5초 후 새로고침 (성공 메시지를 잠시 보여주기 위해)
          }
        }
      } 
      // 대타 요청인지 명확하게 확인 (shiftStatus가 있거나 명시적으로 대타 요청임을 나타내는 다른 지표가 있는 경우)
      else if (notification.shiftStatus !== undefined || notification.message?.includes('대타')) {
        console.log("🔄 이 알림은 대타 요청입니다.");
        
        // 로그인한 사용자 ID 확인
        const userInfoStr = localStorage.getItem("userInfo");
        let currentUserId: number | null = null;
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            currentUserId = userInfo.userId !== undefined ? Number(userInfo.userId) : null;
          } catch (e) {
            console.error("사용자 정보 파싱 오류:", e);
          }
        }
        
        // 현재 사용자가 요청을 받은 사람인지 확인
        const isRequestRecipient = notification.toUserId === currentUserId;
        
        if (!isRequestRecipient) {
          setError("이 대타 요청에 대한 수락 권한이 없습니다.");
          return;
        }
        
        // 근무 교대 요청 승인 - 실제 shiftId 사용 (없으면 알림 ID 폴백)
        let shiftRequestId = notification.shiftId;
        
        // shiftId가 없으면 scheduleId를 사용해보기 
        if (!shiftRequestId && notification.scheduleId) {
          shiftRequestId = notification.scheduleId;
          console.log(`shiftId가 없어 scheduleId(${shiftRequestId})를 사용합니다.`);
        }
        
        // 마지막 폴백으로 알림 ID 사용
        if (!shiftRequestId) {
          shiftRequestId = notification.id;
          console.log(`적절한 ID가 없어 알림 ID(${shiftRequestId})를 사용합니다.`);
        }
        
        console.log(`대타 요청 승인 시도: 실제 shiftId=${shiftRequestId}, 알림ID=${notification.id}`);
        
        // 요청 처리 상태 로깅
        if (notification.scheduleId) {
          console.log(`관련 스케줄 ID: ${notification.scheduleId}`);
        }
        if (notification.fromUserId) {
          console.log(`요청자 ID: ${notification.fromUserId}`);
        }
        if (notification.toUserId) {
          console.log(`대상자 ID: ${notification.toUserId}`);
        }
        
        try {
          // 명시적으로 대타 요청 API 호출
          console.log(`💡 API 호출: /shift-requests/${shiftRequestId}/status?status=APPROVED`);
          response = await updateShiftStatus(shiftRequestId, 'APPROVED');
          console.log("근무 교대 요청 승인 응답:", response);
          setSuccessMessage("근무 교대 요청이 승인되었습니다.");
          
          // 스케줄 업데이트 - 대타 요청이 승인된 경우
          if (response && response.scheduleId) {
            await fetchUpdatedSchedules();
            // 스케줄 갱신 이벤트 발생
            if (response.schedule) {
              // Schedule 타입을 ScheduleUpdateDetail 타입으로 변환
              const scheduleUpdateDetail = {
                scheduleId: response.schedule.scheduleId,
                userId: response.schedule.userId,
                userName: response.schedule.userName,
                startTime: response.schedule.startTime,
                endTime: response.schedule.endTime,
                date: response.schedule.workDate
              };
              triggerScheduleUpdate(scheduleUpdateDetail);
              console.log('스케줄 갱신 이벤트 발생:', scheduleUpdateDetail);
              
              // 페이지 새로고침 추가
              setTimeout(() => {
                window.location.reload();
              }, 1500); // 1.5초 후 새로고침 (성공 메시지를 잠시 보여주기 위해)
            }
          }
        } catch (error) {
          console.error("대타 요청 승인 중 오류:", error);
          if (error instanceof Error) {
            setError(`요청 처리 오류: ${error.message}`);
          } else {
            setError("대타 요청을 처리할 수 없습니다.");
          }
          return; // 오류 발생 시 알림 삭제 안함
        }
      } else {
        console.log("⚠️ 알림 유형을 확인할 수 없습니다. 모든 정보를 기록합니다:");
        console.log(notification);
        setError("알림 유형을 확인할 수 없어 처리할 수 없습니다.");
        return;
      }
      
      // 알림 삭제
      await deleteNotification(notification.id);
      
      // 화면에서 알림 제거
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
      
      // 타이머 설정하여 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("알림 수락 처리 중 오류:", err);
      setError("요청을 처리하는 중 오류가 발생했습니다.");
    } finally {
      setProcessingNotification(null);
    }
  };

  // 알림 거절 처리
  const handleReject = async (notification: Notification) => {
    try {
      setProcessingNotification(notification.id);
      setError(null);
      setSuccessMessage(null);
      
      // 알림 데이터 상세 디버깅 
      console.log("===== 알림 거절 데이터 디버깅 =====");
      console.log(`알림 ID: ${notification.id}`);
      console.log(`알림 타입: ${notification.type}`);
      console.log(`modificationStatus: ${notification.modificationStatus}`);
      console.log(`shiftStatus: ${notification.shiftStatus}`);
      console.log(`scheduleId: ${notification.scheduleId}`);
      console.log(`shiftId: ${notification.shiftId}`);
      console.log(`fromUserId: ${notification.fromUserId}`);
      console.log(`toUserId: ${notification.toUserId}`);
      console.log(`메시지: ${notification.message}`);
      console.log("============================");
      
      // 근무 수정 요청인지 명확하게 확인 (modificationStatus가 있고 shiftStatus가 없는 경우)
      if (notification.modificationStatus !== undefined && notification.shiftStatus === undefined) {
        console.log("🔄 이 알림은 근무 수정 요청입니다.");
        // 근무 수정 요청 거절
        await updateModificationStatus(notification.id, 'REJECTED');
        setSuccessMessage("근무 수정 요청이 거절되었습니다.");
      } 
      // 대타 요청인지 명확하게 확인 (shiftStatus가 있거나 명시적으로 대타 요청임을 나타내는 다른 지표가 있는 경우)
      else if (notification.shiftStatus !== undefined || notification.message?.includes('대타')) {
        console.log("🔄 이 알림은 대타 요청입니다.");
        
        // 로그인한 사용자 ID 확인
        const userInfoStr = localStorage.getItem("userInfo");
        let currentUserId: number | null = null;
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            currentUserId = userInfo.userId !== undefined ? Number(userInfo.userId) : null;
          } catch (e) {
            console.error("사용자 정보 파싱 오류:", e);
          }
        }
        
        // 현재 사용자가 요청을 받은 사람인지 확인
        const isRequestRecipient = notification.toUserId === currentUserId;
        
        if (!isRequestRecipient) {
          setError("이 대타 요청에 대한 거절 권한이 없습니다.");
          return;
        }
        
        // 근무 교대 요청 거절 - 실제 shiftId 사용 (없으면 알림 ID 폴백)
        let shiftRequestId = notification.shiftId;
        
        // shiftId가 없으면 scheduleId를 사용해보기 
        if (!shiftRequestId && notification.scheduleId) {
          shiftRequestId = notification.scheduleId;
          console.log(`shiftId가 없어 scheduleId(${shiftRequestId})를 사용합니다.`);
        }
        
        // 마지막 폴백으로 알림 ID 사용
        if (!shiftRequestId) {
          shiftRequestId = notification.id;
          console.log(`적절한 ID가 없어 알림 ID(${shiftRequestId})를 사용합니다.`);
        }
        
        console.log(`대타 요청 거절 시도: 실제 shiftId=${shiftRequestId}, 알림ID=${notification.id}`);
        
        // 요청 처리 상태 로깅
        if (notification.scheduleId) {
          console.log(`관련 스케줄 ID: ${notification.scheduleId}`);
        }
        if (notification.fromUserId) {
          console.log(`요청자 ID: ${notification.fromUserId}`);
        }
        if (notification.toUserId) {
          console.log(`대상자 ID: ${notification.toUserId}`);
        }
        
        try {
          // 명시적으로 대타 요청 API 호출
          console.log(`💡 API 호출: /shift-requests/${shiftRequestId}/status?status=REJECTED`);
          await updateShiftStatus(shiftRequestId, 'REJECTED');
          setSuccessMessage("근무 교대 요청이 거절되었습니다.");
        } catch (error) {
          console.error("대타 요청 거절 중 오류:", error);
          if (error instanceof Error) {
            setError(`요청 처리 오류: ${error.message}`);
          } else {
            setError("대타 요청을 처리할 수 없습니다.");
          }
          return; // 오류 발생 시 알림 삭제 안함
        }
      } else {
        console.log("⚠️ 알림 유형을 확인할 수 없습니다. 모든 정보를 기록합니다:");
        console.log(notification);
        setError("알림 유형을 확인할 수 없어 처리할 수 없습니다.");
        return;
      }
      
      // 알림 삭제
      await deleteNotification(notification.id);
      
      // 화면에서 알림 제거
      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
      
      // 타이머 설정하여 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("알림 거절 처리 중 오류:", err);
      setError("요청을 처리하는 중 오류가 발생했습니다.");
    } finally {
      setProcessingNotification(null);
    }
  };

  // 한국 시간으로 변환하는 함수
  const formatKoreanTime = (dateString: string) => {
    try {
      // 원본 UTC 날짜 파싱
      const date = new Date(dateString);
      
      // 한국 시간으로 변환 (UTC+9)
      // 기존 방식은 UTC 시간을 기준으로 계산하므로 문제가 있을 수 있음
      // 새로운 방식: 로컬 시간으로 변환한 후 9시간 추가
      const koreanTime = new Date(date);
      koreanTime.setHours(koreanTime.getHours() + 9);
      
      // 날짜 형식 지정 (YYYY. M. D. 오전/오후 H:MM)
      const year = koreanTime.getFullYear();
      const month = koreanTime.getMonth() + 1;
      const day = koreanTime.getDate();
      const hours = koreanTime.getHours();
      const minutes = koreanTime.getMinutes().toString().padStart(2, '0');
      
      const ampm = hours < 12 ? '오전' : '오후';
      const displayHours = hours % 12 || 12;
      
      return `${year}. ${month}. ${day}. ${ampm} ${displayHours}:${minutes}`;
    } catch (error) {
      console.error("날짜 변환 중 오류:", error);
      return dateString;
    }
  };

  // 알림 형식에 따른 메시지 렌더링
  const renderNotificationMessage = (notification: Notification) => {
    console.log('렌더링할 알림 데이터:', notification);
    
    // 수정 요청인 경우
    if (notification.modificationStatus !== undefined) {
      return (
        <div className={styles.alarmContent}>
          <div>
            <span style={{ fontWeight: "700" }}>근무 수정 요청</span>
          </div>
          <div>{formatKoreanTime(notification.createdAt)}</div>
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
          <div>{formatKoreanTime(notification.createdAt)}</div>
          <div>{notification.message}</div>
        </div>
      );
    }
    
    // 일반 알림인 경우
    return (
      <div className={styles.alarmContent}>
        <div>{notification.message}</div>
        <div>{formatKoreanTime(notification.createdAt)}</div>
      </div>
    );
  };

  // 스케줄 데이터 갱신 함수
  const fetchUpdatedSchedules = async () => {
    try {
      // 현재 선택된 매장의 스케줄 데이터를 다시 불러옴
      if (!selectedStore) {
        console.log("선택된 매장이 없어 스케줄을 업데이트할 수 없습니다.");
        return;
      }
      
      console.log(`매장 ID ${selectedStore}의 스케줄 데이터 갱신 시작`);
      
      // 토큰 가져오기
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("토큰이 없습니다. 인증을 확인하세요.");
        return;
      }
      
      // 스케줄 데이터 가져오기
      const axiosInstance = await import("../../api/loginAxios").then(module => module.default);
      const res = await axiosInstance.get(`/schedule/store/${selectedStore}`);
      
      if (!res.data) {
        console.error("스케줄 데이터가 없습니다.");
        return;
      }
      
      // 스케줄 데이터 업데이트
      setOwnerSchedules(res.data);
      console.log("스케줄 데이터가 성공적으로 업데이트되었습니다:", res.data);
      
    } catch (error) {
      console.error("스케줄 데이터 갱신 중 오류 발생:", error);
    }
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
          
          {successMessage && (
            <p className={styles.successMessage}>{successMessage}</p>
          )}
          
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>알림을 불러오는 중...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => {
              // 로그인한 사용자 ID 확인
              const userInfoStr = localStorage.getItem("userInfo");
              let currentUserId: number | null = null;
              if (userInfoStr) {
                try {
                  const userInfo = JSON.parse(userInfoStr);
                  currentUserId = userInfo.userId !== undefined ? Number(userInfo.userId) : null;
                } catch (e) {
                  console.error("사용자 정보 파싱 오류:", e);
                }
              }
              
              // 현재 사용자가 요청을 받은 사람인지 확인
              const isRequestRecipient = notification.toUserId === currentUserId;
              
              return (
                <div key={notification.id} className={styles.contentBox}>
                  {renderNotificationMessage(notification)}
                  
                  {/* 대타 요청을 받은 사람인 경우에만 수락/거절 버튼 표시 */}
                  {isRequestRecipient && (notification.shiftStatus === 'PENDING' || notification.modificationStatus === 'PENDING') && (
                    <div className={styles.alarmButton}>
                      <Button
                        width="105px"
                        height="35px"
                        onClick={() => handleAccept(notification)}
                        disabled={processingNotification === notification.id}
                      >
                        {processingNotification === notification.id ? "처리 중..." : "수락하기"}
                      </Button>
                      <Button
                        width="105px"
                        height="35px"
                        variant="gray"
                        onClick={() => handleReject(notification)}
                        disabled={processingNotification === notification.id}
                      >
                        {processingNotification === notification.id ? "처리 중..." : "거절하기"}
                      </Button>
                    </div>
                  )}
                  
                  {/* 대타 요청을 보낸 사람이거나 처리 완료된 상태인 경우 상태 표시 */}
                  {(notification.fromUserId === currentUserId || notification.shiftStatus === 'APPROVED' || notification.shiftStatus === 'REJECTED') && (
                    <div className={styles.statusMessage}>
                      {notification.shiftStatus === 'APPROVED' ? '승인됨' : 
                       notification.shiftStatus === 'REJECTED' ? '거절됨' : '처리 대기 중'}
                    </div>
                  )}
                </div>
              );
            })
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
