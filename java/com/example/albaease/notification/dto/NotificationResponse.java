package com.example.albaease.notification.dto;

import com.example.albaease.modification.domain.enums.ModificationStatus;
import com.example.albaease.notification.domain.entity.Notification;
import com.example.albaease.notification.domain.enums.NotificationReadStatus;
import com.example.albaease.notification.domain.enums.NotificationType;
import com.example.albaease.shift.domain.enums.ShiftStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private Long scheduleId;
    private NotificationType type;
    private NotificationReadStatus readStatus;
    private String message;
    private LocalDateTime createdAt;

    // 대타 요청 관련 필드
    private Long fromUserId;
    private Long toUserId;
    private ShiftStatus shiftStatus;

    // 수정 요청 관련 필드
    private String details;
    private ModificationStatus modificationStatus;

    // 알림 목록 관련 필드
    private List<NotificationResponse> notifications;
    private boolean hasUnread;

    public static NotificationResponse from(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getNotification_id())
                .userId(notification.getUser().getUserId())
                .scheduleId(notification.getSchedule().getScheduleId())
                .type(notification.getRequestType())
                .readStatus(notification.getStatus())
                .message(notification.getMessage())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    // 알림 목록 변환
    public static NotificationResponse ofList(List<Notification> notifications, boolean hasUnread) {
        List<NotificationResponse> responseList = notifications.stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());

        return NotificationResponse.builder()
                .notifications(responseList)
                .hasUnread(hasUnread)
                .build();
    }
}
