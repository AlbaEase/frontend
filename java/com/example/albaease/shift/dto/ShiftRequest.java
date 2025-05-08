package com.example.albaease.shift.dto;

import com.example.albaease.shift.domain.enums.ShiftRequestType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class ShiftRequest {
    private Long fromUserId;
    private Long toUserId;
    private Long scheduleId;
    private ShiftRequestType requestType;
    private LocalDate requestDate; // 대타 요청 대상 날짜 추가

    public void setFromUserId(Long fromUserId) {
        this.fromUserId = fromUserId;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }
}
