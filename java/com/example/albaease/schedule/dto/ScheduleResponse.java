package com.example.albaease.schedule.dto;

import com.example.albaease.schedule.domain.Schedule;
import com.example.albaease.user.entity.User;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class ScheduleResponse {
    private Long scheduleId;
    private Long userId;
    private String fullName;
    private Long storeId;
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime breakTime;
    private List<String> repeatDays;
    private LocalDate repeatEndDate;

    // 대타 관련 필드 추가
    private boolean isShiftChanged;  // 대타 변경 여부
    private Long originalUserId;     // 원래 스케줄의 사용자 ID (대타인 경우)
    private String originalUserName; // 원래 스케줄의 사용자 이름 (대타인 경우)

    public static ScheduleResponse fromEntity(Schedule schedule) {
        ScheduleResponse response = new ScheduleResponse();
        response.setScheduleId(schedule.getScheduleId());
        response.setUserId(schedule.getUser().getUserId());
        String fullName = schedule.getUser().getLastName() + schedule.getUser().getFirstName();
        response.setFullName(fullName.trim());
        response.setStoreId(schedule.getStoreId());
        response.setWorkDate(schedule.getWorkDate());
        response.setStartTime(schedule.getStartTime());
        response.setEndTime(schedule.getEndTime());
        response.setBreakTime(schedule.getBreakTime());
        response.setRepeatDays(schedule.getRepeatDaysList());
        response.setRepeatEndDate(schedule.getRepeatEndDate());
        response.setShiftChanged(false); // 기본적으로 대타가 아님
        return response;
    }
}
