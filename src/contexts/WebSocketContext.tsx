import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../api/websocket';

// 알림 타입 정의
interface Notification {
  id: number;
  type: string;
  message: string;
  readStatus: 'READ' | 'UNREAD';
  createdAt: string;
  [key: string]: unknown;
}

interface WebSocketContextType {
  hasNewNotification: boolean;
  markNotificationsRead: () => void;
  lastNotification: Notification | null;
}

// 기본값 생성
const defaultContext: WebSocketContextType = {
  hasNewNotification: false,
  markNotificationsRead: () => {},
  lastNotification: null
};

// Context 생성
const WebSocketContext = createContext<WebSocketContextType>(defaultContext);

// Custom Hook
export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [hasNewNotification, setHasNewNotification] = useState<boolean>(false);
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);

  // 웹소켓 연결 설정
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // 웹소켓 연결
    connectWebSocket(token, {
      onConnect: () => {
        console.log('WebSocket connected in context');
      },
      onNotification: (notification) => {
        console.log('New notification received:', notification);
        setHasNewNotification(true);
        setLastNotification(notification as Notification);
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      }
    });

    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // 알림을 읽음 상태로 표시
  const markNotificationsRead = () => {
    setHasNewNotification(false);
  };

  // Context 값 정의
  const contextValue: WebSocketContextType = {
    hasNewNotification,
    markNotificationsRead,
    lastNotification
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext; 