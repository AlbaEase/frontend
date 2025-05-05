package com.example.albaease.modification.domain.entity;

import com.example.albaease.modification.domain.enums.ModificationStatus;
import com.example.albaease.user.entity.User;
import com.example.albaease.schedule.domain.Schedule;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Modification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long modification_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ModificationStatus status = ModificationStatus.PENDING;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public Modification(User user, Schedule schedule, String details) {
        this.user = user;
       // this.schedule = schedule;
        this.details = details;
        this.status = ModificationStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void updateStatus(ModificationStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
}
