package com.example.albaease.notification.controller;

import com.example.albaease.notification.dto.NotificationRequest;
import com.example.albaease.notification.dto.NotificationResponse;
import com.example.albaease.notification.service.NotificationService;
import com.example.albaease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Slf4j
@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    
    // 알림 목록 조회
    @GetMapping("/me")
    public ResponseEntity<NotificationResponse> getNotifications(
            @RequestParam(required = false) Long userId) {
        
        // 요청 파라미터로 userId가 제공된 경우 사용, 아니면 현재 인증된 사용자의 ID 사용
        Long userIdToUse = (userId != null) ? userId : getCurrentUserId();
        log.info("Getting notifications for userId: {}", userIdToUse);
        
        NotificationResponse response = notificationService.getUserNotifications(userIdToUse);
        return ResponseEntity.ok(response);
    }
    
    // 알림 개별 삭제
    @DeleteMapping("/me/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        log.info("Deleting notification: {}", notificationId);
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    // 알림 전체 삭제
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAllNotifications(
            @RequestParam(required = false) Long userId) {
        
        Long userIdToUse = (userId != null) ? userId : getCurrentUserId();
        log.info("Deleting all notifications for userId: {}", userIdToUse);
        
        notificationService.deleteAllNotifications(userIdToUse);
        return ResponseEntity.noContent().build();
    }
    
    // WebSocket을 통해 알림 전송
    @MessageMapping("/notification")
    @SendToUser("/queue/notifications")
    public NotificationResponse handleNotification(NotificationRequest request) {
        if (request.getUserId() == null) {
            Long userId = getCurrentUserId();
            log.info("Setting userId from auth context: {}", userId);
            request.setUserId(userId);
        }
        
        return notificationService.createNotification(request);
    }
    
    // WebSocket 구독 요청 처리
    @MessageMapping("/subscribe")
    public void subscribe(StompHeaderAccessor headerAccessor, Principal principal) {
        // WebSocket 세션에 userId 저장
        if (principal != null) {
            headerAccessor.getSessionAttributes().put("userId", principal.getName());
            log.info("WebSocket subscription registered for user: {}", principal.getName());
        }
    }
    
    // 현재 인증된 사용자의 ID 가져오기
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }
        
        // 인증 객체의 principal이 사용자 ID인 경우
        Object principal = authentication.getPrincipal();
        
        try {
            if (principal instanceof String) {
                // String 형태의 ID 또는 이메일 처리
                String principalStr = (String) principal;
                try {
                    // ID로 파싱 시도
                    return Long.parseLong(principalStr);
                } catch (NumberFormatException e) {
                    // 이메일인 경우 사용자 조회
                    log.info("Looking up user by email: {}", principalStr);
                    return userRepository.findByEmail(principalStr)
                        .map(user -> user.getUserId()) // 또는 getId()
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + principalStr));
                }
            } else if (principal instanceof Number) {
                return ((Number) principal).longValue();
            }
            
            // 다른 타입의 principal 처리
            log.warn("Unknown principal type: {}", principal.getClass().getName());
            throw new RuntimeException("지원되지 않는 인증 정보입니다.");
        } catch (Exception e) {
            log.error("Error extracting user ID from authentication", e);
            throw new RuntimeException("사용자 ID를 확인할 수 없습니다.", e);
        }
    }
}