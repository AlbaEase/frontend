import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../api/websocket';
import { Notification } from '../types/api';
import { checkAuthAndSetToken } from '../api/apiService';
import { getToken } from '../api/loginAxios';

// 알림 컨텍스트 타입 정의
interface WebSocketContextType {
  hasNewNotification: boolean;
  markNotificationsRead: () => void;
  lastNotification: Notification | null;
  isConnected: boolean;
  reconnect: () => void;
}

// 기본값 생성
const defaultContext: WebSocketContextType = {
  hasNewNotification: false,
  markNotificationsRead: () => {},
  lastNotification: null,
  isConnected: false,
  reconnect: () => {}
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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [reconnectTrigger, setReconnectTrigger] = useState<number>(0);

  // 웹소켓 연결 및 재연결 함수
  const setupWebSocketConnection = () => {
    // 인증 상태 확인
    const isAuthenticated = checkAuthAndSetToken();
    if (!isAuthenticated) {
      console.warn("🚨 인증되지 않은 사용자: WebSocket 연결을 시도하지 않습니다.");
      return;
    }
    
    // getToken 함수를 사용하여 유효한 토큰 획득
    const token = getToken();
    if (!token) {
      console.warn("🚨 토큰이 없거나 유효하지 않아 WebSocket 연결을 시도하지 않습니다.");
      return;
    }

    console.log("✅ WebSocket 연결 시도 중...");
    
    // 기존 연결 정리
    disconnectWebSocket();
    
    // 웹소켓 연결
    connectWebSocket(token, {
      onConnect: () => {
        console.log('WebSocket connected in context');
        setIsConnected(true);
      },
      onNotification: (data) => {
        console.log('New notification received:', data);
        setHasNewNotification(true);
        
        try {
          // 서버에서 받은 알림 데이터를 Notification 타입으로 안전하게, 사용 가능한 키 변환
          const notification: Notification = {
            id: typeof data.id === 'number' ? data.id : 0,
            userId: typeof data.userId === 'number' ? data.userId : 0,
            type: (data.type as string) === 'ALL_USERS' ? 'ALL_USERS' : 'SPECIFIC_USER',
            message: typeof data.message === 'string' ? data.message : '',
            readStatus: (data.readStatus as string) === 'READ' ? 'READ' : 'UNREAD',
            createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
            scheduleId: typeof data.scheduleId === 'number' ? data.scheduleId : undefined,
            details: typeof data.details === 'string' ? data.details : undefined
          };
          
          setLastNotification(notification);
        } catch (error) {
          console.error('알림 데이터 처리 중 오류:', error);
          console.error('원본 데이터:', data);
        }
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      }
    });
  };

  // 컴포넌트 마운트 또는 재연결 트리거가 변경될 때마다 웹소켓 연결 설정
  useEffect(() => {
    setupWebSocketConnection();

    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => {
      console.log("🔌 WebSocket 연결 해제 중...");
      disconnectWebSocket();
      setIsConnected(false);
    };
  }, [reconnectTrigger]);
  
  // 토큰 변경 이벤트 감지
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'accessToken') {
        console.log('토큰이 변경되었습니다. WebSocket 재연결을 시도합니다.');
        setupWebSocketConnection();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 재연결 함수
  const reconnect = () => {
    console.log('WebSocket 재연결 요청...');
    setReconnectTrigger(prev => prev + 1);
  };

  // 알림을 읽음 상태로 표시
  const markNotificationsRead = () => {
    setHasNewNotification(false);
  };

  // Context 값 정의
  const contextValue: WebSocketContextType = {
    hasNewNotification,
    markNotificationsRead,
    lastNotification,
    isConnected,
    reconnect
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext; 