package com.example.albaease.schedule.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TemplateScheduleRequest {
    private List<Long> userIds;  // 여러 명의 사용자 ID 리스트
    private Long storeId;         // 매장 ID
    private LocalDate workDate;   // 근무 날짜
    private LocalTime startTime;  // 시작 시간
    private LocalTime endTime;    // 종료 시간
    private LocalTime breakTime;  // 휴게 시간
    private List<String> repeatDays;  // 반복 요일 (월, 화, 수 등)
    private LocalDate repeatEndDate;  // 반복 종료 날짜

    public boolean isRepeating() {
        return repeatDays != null && !repeatDays.isEmpty();
    }
}
