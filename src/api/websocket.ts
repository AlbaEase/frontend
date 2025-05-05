import { Client, StompSubscription } from '@stomp/stompjs';

interface WebSocketCallbacks {
  onConnect?: () => void;
  onNotification?: (data: Record<string, unknown>) => void;
  onError?: (error: unknown) => void;
}

let stompClient: Client | null = null;
let subscription: StompSubscription | null = null;

// 백엔드 서버 주소
const WS_URL = 'ws://3.39.237.218:8080/ws';

// 웹소켓 연결 함수
export const connectWebSocket = (token: string, callbacks: WebSocketCallbacks = {}) => {
  if (stompClient && stompClient.connected) {
    console.log('WebSocket already connected');
    return;
  }

  // 토큰이 없는 경우 오류 로깅
  if (!token) {
    console.error('WebSocket 연결 실패: 토큰이 없습니다.');
    if (callbacks.onError) {
      callbacks.onError(new Error('인증 토큰이 없습니다.'));
    }
    return;
  }

  console.log('🔌 WebSocket 연결 시도 - 토큰:', token.substring(0, 10) + '...');

  // 새 STOMP 클라이언트 생성
  stompClient = new Client({
    // brokerURL: `${BASE_URL}/ws`,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    webSocketFactory: () => {
      // 명시적으로 WebSocket 생성하고 직접 URL 구성
      const socket = new WebSocket(WS_URL);
      
      // WebSocket 이벤트 리스너 추가 (디버깅용)
      socket.onopen = () => console.log('Raw WebSocket 연결됨');
      socket.onclose = (event) => console.log('Raw WebSocket 연결 종료:', event.code, event.reason);
      socket.onerror = (error) => console.error('Raw WebSocket 오류:', error);
      
      return socket;
    }
  });

  // 연결 성공 시 콜백
  stompClient.onConnect = () => {
    console.log('✅ STOMP 클라이언트 연결 성공');

    // 개인 알림 구독
    if (stompClient) {
      try {
        subscription = stompClient.subscribe('/user/queue/notifications', (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('📬 알림 수신:', notification);
            if (callbacks.onNotification) {
              callbacks.onNotification(notification);
            }
          } catch (error) {
            console.error('알림 처리 중 오류:', error);
          }
        });
        console.log('✅ 알림 구독 성공');
      } catch (error) {
        console.error('알림 구독 실패:', error);
      }
    }

    // 연결 완료 콜백
    if (callbacks.onConnect) {
      callbacks.onConnect();
    }

    // 사용자 구독 등록 (백엔드에 알림)
    if (stompClient) {
      try {
        stompClient.publish({
          destination: '/app/subscribe',
          body: JSON.stringify({}),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('✅ 구독 등록 메시지 전송 완료');
      } catch (error) {
        console.error('구독 등록 메시지 전송 실패:', error);
      }
    }
  };

  // 에러 콜백
  stompClient.onStompError = (frame) => {
    console.error('❌ STOMP 오류:', frame);
    if (callbacks.onError) {
      callbacks.onError(frame);
    }
  };

  // 연결 종료 콜백
  stompClient.onWebSocketClose = (event) => {
    console.log('WebSocket 연결 종료:', event.code, event.reason);
  };

  // 웹소켓 에러 콜백
  stompClient.onWebSocketError = (event) => {
    console.error('WebSocket 오류 발생:', event);
    if (callbacks.onError) {
      callbacks.onError(event);
    }
  };

  // 웹소켓 연결
  console.log('🔌 STOMP 클라이언트 활성화 중...');
  stompClient.activate();
};

// 웹소켓 연결 해제
export const disconnectWebSocket = () => {
  if (subscription) {
    try {
      subscription.unsubscribe();
      console.log('✅ 알림 구독 해제 완료');
    } catch (error) {
      console.error('알림 구독 해제 실패:', error);
    }
    subscription = null;
  }

  if (stompClient) {
    try {
      stompClient.deactivate();
      console.log('✅ WebSocket 연결 해제 완료');
    } catch (error) {
      console.error('WebSocket 연결 해제 실패:', error);
    }
    stompClient = null;
  }
};

// 알림 전송
export const sendNotification = (type: string, data: Record<string, unknown>) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected');
    return;
  }

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
      return;
  }

  try {
    stompClient.publish({
      destination,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ ${type} 알림 전송 완료:`, data);
  } catch (error) {
    console.error(`${type} 알림 전송 실패:`, error);
  }
}; 