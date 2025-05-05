package com.example.albaease.notification.controller;

import com.example.albaease.notification.dto.NotificationRequest;
import com.example.albaease.notification.dto.NotificationResponse;
import com.example.albaease.notification.service.NotificationService;
import com.example.albaease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserRepository userRepository; // 사용자 조회를 위해 추가

    // 알림 목록 조회
    @GetMapping("/me")
    public ResponseEntity<NotificationResponse> getNotifications(
            Principal principal,
            @RequestParam(required = false) Long userId) {

        Long userIdToUse;

        // 1. 요청 파라미터로 userId가 제공된 경우 사용
        if (userId != null) {
            userIdToUse = userId;
        }
        // 2. 요청 파라미터가 없으면 이메일로 사용자 조회
        else {
            String email = principal.getName();
            userIdToUse = userRepository.findByEmail(email)
                    .map(user -> user.getUserId()) // getId() 대신 getUserId() 사용
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));
        }

        NotificationResponse response = notificationService.getUserNotifications(userIdToUse);
        return ResponseEntity.ok(response);
    }

    // 알림 개별 삭제
    @DeleteMapping("/me/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            Principal principal,
            @PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    // 알림 전체 삭제
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAllNotifications(
            Principal principal,
            @RequestParam(required = false) Long userId) {

        Long userIdToUse;
        if (userId != null) {
            userIdToUse = userId;
        } else {
            String email = principal.getName();
            userIdToUse = userRepository.findByEmail(email)
                    .map(user -> user.getUserId()) // getId() 대신 getUserId() 사용
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));
        }

        notificationService.deleteAllNotifications(userIdToUse);
        return ResponseEntity.noContent().build();
    }

    // WebSocket 메서드도 유사하게 수정
    @MessageMapping("/notification")
    @SendToUser("/queue/notifications")
    public NotificationResponse handleNotification(
            Principal principal,
            NotificationRequest request) {

        if (request.getUserId() != null) {
            // 요청에 이미 userId가 있으면 그대로 사용
            return notificationService.createNotification(request);
        } else {
            // userId가 없으면 이메일로 조회
            String email = principal.getName();
            Long userId = userRepository.findByEmail(email)
                    .map(user -> user.getUserId()) // getId() 대신 getUserId() 사용
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));

            request.setUserId(userId);
            return notificationService.createNotification(request);
        }
    }

    // WebSocket 구독은 그대로 유지
    @MessageMapping("/subscribe")
    public void subscribe(StompHeaderAccessor headerAccessor, Principal principal) {
        String userId = principal.getName();
        headerAccessor.getSessionAttributes().put("userId", userId);
    }
}
