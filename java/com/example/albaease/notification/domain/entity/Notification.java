package com.example.albaease.notification.domain.entity;

import com.example.albaease.notification.domain.enums.NotificationReadStatus;
import com.example.albaease.notification.domain.enums.NotificationType;
import com.example.albaease.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.example.albaease.schedule.domain.Schedule;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notification_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationReadStatus status = NotificationReadStatus.UNREAD;

    @Enumerated(EnumType.STRING)
    private NotificationType requestType;

    private LocalDateTime createdAt;

    @Builder
    public Notification(User user, Schedule schedule, String message,
                        NotificationReadStatus status, NotificationType requestType) {
        this.user = user;
        this.schedule = schedule;
        this.message = message;
        this.status = status;
        this.requestType = requestType;
        this.createdAt = LocalDateTime.now();
    }

    public void markAsRead() {
        this.status = NotificationReadStatus.READ;
    }
}
