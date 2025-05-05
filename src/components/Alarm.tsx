import { useState, useEffect } from "react";
import styles from "./Alarm.module.css";
import bell from "../assets/bell.svg";
import { fetchNotifications } from "../api/apiService";
import { connectWebSocket, disconnectWebSocket } from "../api/websocket";

// 부모로부터 Props를 전달받아서 사용하는 곳이다.
interface AlarmProps {
    onClick: () => void;
}

const Alarm: React.FC<AlarmProps> = ({ onClick }) => {
    /* 읽지 않은 알림이 있는지 여부 */
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    
    // 컴포넌트 마운트 시 알림 상태 확인 및 웹소켓 연결
    useEffect(() => {
        // 알림 목록 조회하여 읽지 않은 알림 여부 확인
        const checkNotifications = async () => {
            try {
                const notifications = await fetchNotifications();
                // 읽지 않은 알림이 있는지 확인
                const hasUnread = Array.isArray(notifications) && 
                    notifications.some(notification => notification.readStatus === 'UNREAD');
                setHasUnreadNotifications(hasUnread);
            } catch (error) {
                console.error("알림 상태 확인 중 오류:", error);
            }
        };
        
        checkNotifications();
        
        // 웹소켓 연결
        const token = localStorage.getItem("accessToken");
        if (token) {
            connectWebSocket(token, {
                onNotification: () => {
                    // 새 알림이 오면 알림 상태 업데이트
                    setHasUnreadNotifications(true);
                }
            });
        }
        
        // 컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => {
            disconnectWebSocket();
        };
    }, []);

    const handleClick = () => {
        // 알림 아이콘 클릭 시 읽은 상태로 변경
        setHasUnreadNotifications(false);
        onClick();
    };

    return (
        <div className={styles.alarm} onClick={handleClick}>
            <div className={`${hasUnreadNotifications ? styles.existAlarm : " "}`} />
            <img src={bell} alt="bell" className={styles.bellImg} />
        </div>
    );
};

export default Alarm;
