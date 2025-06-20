import { Client, StompSubscription, IMessage, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../utils/sockjs-polyfill'; // 폴리필 명시적으로 가져오기

// API 서버 URL 설정
const isDev = import.meta.env.MODE === 'development';
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                    (isDev ? 'http://localhost:8080' : 'http://3.39.237.218:8080');
// SockJS 사용을 위한 엔드포인트 수정
const WS_ENDPOINT = `${API_BASE_URL}/ws`;

// 디버깅을 위해 현재 사용 중인 API URL 출력
console.log(`현재 API URL: ${API_BASE_URL}, 환경: ${isDev ? '개발' : '프로덕션'}`);

interface WebSocketCallbacks {
  onConnect?: () => void;
  onNotification?: (data: Record<string, unknown>) => void;
  onError?: (error: unknown) => void;
  onDisconnect?: () => void;
}

let stompClient: Client | null = null;
let subscription: StompSubscription | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// 웹소켓 연결 함수
export const connectWebSocket = (token: string, callbacks: WebSocketCallbacks = {}) => {
  if (!token) {
    console.error('WebSocket 연결 실패: 토큰이 제공되지 않았습니다.');
    if (callbacks.onError) {
      callbacks.onError(new Error('토큰이 제공되지 않았습니다.'));
    }
    return;
  }

  if (stompClient && stompClient.connected) {
    console.log('WebSocket already connected');
    if (callbacks.onConnect) {
      callbacks.onConnect();
    }
    return;
  }

  console.log('WebSocket 연결 시도...');
  console.log(`WebSocket Endpoint: ${WS_ENDPOINT}`);
  console.log(`토큰 값 확인: ${token.substring(0, 15)}...`);
  
  // 디버깅을 위한 토큰 검증
  if (token.startsWith('Bearer ')) {
    console.log('토큰에 이미 Bearer 접두사가 포함되어 있습니다.');
    // 중복 접두사 방지
    token = token.substring(7);
  }

  try {
    // 새 STOMP 클라이언트 생성
    stompClient = new Client({
      // 직접적인 WebSocket URL 대신 SockJS를 사용하여 연결
      webSocketFactory: () => {
        try {
          // SockJS 인스턴스 생성 시 예외 처리 추가
          const socket = new SockJS(WS_ENDPOINT);
          console.log('SockJS 인스턴스 생성됨:', socket);
          return socket;
        } catch (error) {
          console.error('SockJS 인스턴스 생성 중 오류:', error);
          throw error;
        }
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str: string) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    // 연결 성공 시 콜백
    stompClient.onConnect = (frame: IFrame) => {
      console.log('Connected to WebSocket');
      console.log('연결 성공 프레임:', frame);
      reconnectAttempts = 0; // 연결 성공 시 재시도 카운터 초기화

      // 개인 알림 구독
      if (stompClient) {
        subscription = stompClient.subscribe('/user/queue/notifications', (message: IMessage) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Received notification:', notification);
            if (callbacks.onNotification) {
              callbacks.onNotification(notification);
            }
          } catch (error) {
            console.error('알림 메시지 처리 중 오류:', error);
            console.error('원본 메시지:', message.body);
          }
        }, {
          // 구독 시에도 인증 헤더 포함
          Authorization: `Bearer ${token}`
        });
      }

      // 연결 완료 콜백
      if (callbacks.onConnect) {
        callbacks.onConnect();
      }

      // 사용자 구독 등록 (백엔드에 알림)
      if (stompClient) {
        stompClient.publish({
          destination: '/app/subscribe',
          body: JSON.stringify({}),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    };

    // 에러 콜백
    stompClient.onStompError = (frame: IFrame) => {
      console.error('STOMP error:', frame);
      if (callbacks.onError) {
        callbacks.onError(frame);
      }
    };

    // 연결 해제 콜백
    stompClient.onWebSocketClose = (event) => {
      console.log('WebSocket connection closed', event);
      if (callbacks.onDisconnect) {
        callbacks.onDisconnect();
      }
      
      // 연결 해제 시 재연결 시도 (최대 시도 횟수 제한)
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`WebSocket 재연결 시도 ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
        
        // 토큰 갱신 시도
        const currentToken = localStorage.getItem('accessToken');
        if (currentToken && currentToken !== token) {
          console.log('토큰이 변경되어 새 토큰으로 재연결합니다.');
          setTimeout(() => connectWebSocket(currentToken, callbacks), 3000);
        } else if (currentToken) {
          setTimeout(() => connectWebSocket(currentToken, callbacks), 3000);
        }
      }
    };

    // 웹소켓 연결
    stompClient.activate();
  } catch (error) {
    console.error('WebSocket 연결 중 오류:', error);
    if (callbacks.onError) {
      callbacks.onError(error);
    }
  }
};

// 웹소켓 연결 해제
export const disconnectWebSocket = () => {
  if (subscription) {
    try {
      subscription.unsubscribe();
    } catch (error) {
      console.error('구독 해제 중 오류:', error);
    }
    subscription = null;
  }

  if (stompClient) {
    try {
      stompClient.deactivate();
    } catch (error) {
      console.error('WebSocket 연결 해제 중 오류:', error);
    }
    stompClient = null;
    console.log('Disconnected from WebSocket');
  }
};

// 알림 전송
export const sendNotification = (type: string, data: Record<string, unknown>) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected');
    return false;
  }

  const token = localStorage.getItem('accessToken');
  
  // 타입에 따라 적절한 엔드포인트로 메시지 전송
  let destination = '';
  switch (type) {
    case 'notification':
      destination = '/app/notification';
      break;
    case 'modification':
      destination = '/app/modification';
      break;
    case 'shift':
      destination = '/app/shift-requests';
      break;
    default:
      console.error('Invalid notification type');
      return false;
  }

  try {
    stompClient.publish({
      destination,
      body: JSON.stringify(data),
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : undefined
    });
    return true;
  } catch (error) {
    console.error('알림 전송 중 오류:', error);
    return false;
  }
}; 