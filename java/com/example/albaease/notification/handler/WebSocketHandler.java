package com.example.albaease.notification.handler;

import com.example.albaease.notification.domain.enums.NotificationType;
import com.example.albaease.notification.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandler {
    private final SimpMessageSendingOperations messagingTemplate;
    private static final Map<String, String> CLIENTS = new ConcurrentHashMap<>();

    public void sendNotification(NotificationResponse notification) {
        // 전체 사용자에게 알림 전송
        if (notification.getType() == NotificationType.ALL_USERS) {
            messagingTemplate.convertAndSend("/topic/notifications", notification);
        } else {
            // 특정 사용자에게 알림 전송
            messagingTemplate.convertAndSendToUser(
                    notification.getUserId().toString(),
                    "/queue/notifications",
                    notification
            );
        }
    }

    public void sendNotificationDeleteAll(Long userId) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications/delete-all",
                "모든 알림이 삭제되었습니다."
        );
    }

    public void sendShiftStatusUpdate(Long userId, String message) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications/shift-status",
                message
        );
    }

    public void sendModificationStatusUpdate(Long userId, String message) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications/modification-status",
                message
        );
    }

    // 사용자가 웹소켓에 연결된 후 세션 정보를 저장
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();
        if (principal != null) {
            String userId = principal.getName();
            CLIENTS.put(userId, headerAccessor.getSessionId());
            log.info("✅ 새로운 웹소켓 연결: 사용자 ID = {}", userId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();
        if (principal != null) {
            String userId = principal.getName();
            CLIENTS.remove(userId);
            log.info("❌ 웹소켓 연결 해제: 사용자 ID = {}", userId);
        }
    }
}
