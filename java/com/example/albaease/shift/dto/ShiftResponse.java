package com.example.albaease.shift.dto;

import com.example.albaease.shift.domain.entity.Shift;
import com.example.albaease.shift.domain.enums.ShiftRequestType;
import com.example.albaease.shift.domain.enums.ShiftStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ShiftResponse {
    private Long id;
    private Long fromUserId;
    private Long toUserId;
    private Long scheduleId;
    private Long approvedBy;
    private ShiftRequestType requestType;
    private ShiftStatus status;
    private LocalDate requestDate; // 대타 요청 대상 날짜 추가
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ShiftResponse from(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getRequest_id())
                .fromUserId(shift.getFromUser().getUserId())
                .toUserId(shift.getToUser().getUserId())
                .scheduleId(shift.getSchedule().getScheduleId())
                .approvedBy(shift.getApprovedBy() != null ? shift.getApprovedBy().getUserId() : null)
                .requestType(shift.getRequestType())
                .status(shift.getStatus())
                .requestDate(shift.getRequestDate()) // 대타 요청 대상 날짜 추가
                .createdAt(shift.getCreatedAt())
                .updatedAt(shift.getUpdatedAt())
                .build();
    }
}
