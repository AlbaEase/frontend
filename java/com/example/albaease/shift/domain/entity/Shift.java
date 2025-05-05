package com.example.albaease.shift.domain.entity;

import com.example.albaease.shift.domain.enums.ShiftRequestType;
import com.example.albaease.shift.domain.enums.ShiftStatus;
import com.example.albaease.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.example.albaease.schedule.domain.Schedule;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long request_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id")
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id")
    private User toUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Enumerated(EnumType.STRING)
    private ShiftRequestType requestType;

    @Enumerated(EnumType.STRING)
    private ShiftStatus status = ShiftStatus.PENDING;

    // 대타 요청 대상 날짜
    private LocalDate requestDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public Shift(User fromUser, User toUser, Schedule schedule,
                 ShiftRequestType requestType, LocalDate requestDate) {
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.schedule = schedule;
        this.requestType = requestType;
        this.requestDate = requestDate;
        this.status = ShiftStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void updateStatus(ShiftStatus status, User approvedBy) {
        this.status = status;
        this.approvedBy = approvedBy;
        this.updatedAt = LocalDateTime.now();
    }
}
