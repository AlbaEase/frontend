import { Client, StompSubscription } from '@stomp/stompjs';

interface WebSocketCallbacks {
  onConnect?: () => void;
  onNotification?: (data: Record<string, unknown>) => void;
  onError?: (error: unknown) => void;
}

let stompClient: Client | null = null;
let subscription: StompSubscription | null = null;

const BASE_URL = 'ws://3.39.237.218:8080'; // 백엔드 서버 주소

// 웹소켓 연결 함수
export const connectWebSocket = (token: string, callbacks: WebSocketCallbacks = {}) => {
  if (stompClient && stompClient.connected) {
    console.log('WebSocket already connected');
    return;
  }

  // 새 STOMP 클라이언트 생성
  stompClient = new Client({
    brokerURL: `${BASE_URL}/ws`,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  // 연결 성공 시 콜백
  stompClient.onConnect = () => {
    console.log('Connected to WebSocket');

    // 개인 알림 구독
    if (stompClient) {
      subscription = stompClient.subscribe('/user/queue/notifications', (message) => {
        const notification = JSON.parse(message.body);
        console.log('Received notification:', notification);
        if (callbacks.onNotification) {
          callbacks.onNotification(notification);
        }
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
      });
    }
  };

  // 에러 콜백
  stompClient.onStompError = (frame) => {
    console.error('STOMP error:', frame);
    if (callbacks.onError) {
      callbacks.onError(frame);
    }
  };

  // 웹소켓 연결
  stompClient.activate();
};

// 웹소켓 연결 해제
export const disconnectWebSocket = () => {
  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }

  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('Disconnected from WebSocket');
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

  stompClient.publish({
    destination,
    body: JSON.stringify(data),
  });
}; 