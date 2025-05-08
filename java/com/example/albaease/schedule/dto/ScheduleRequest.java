package com.example.albaease.schedule.dto;

import com.example.albaease.schedule.domain.Schedule;
import com.example.albaease.store.domain.Store;
import com.example.albaease.store.repository.StoreRepository;
import com.example.albaease.user.entity.User;
import com.example.albaease.user.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ScheduleRequest {

    private List<Long> userIds; // 여러 명의 사용자 ID를 받음
    private Long storeId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(type = "string", example = "2025-04-28")
    private LocalDate workDate;

    @JsonFormat(pattern = "HH:mm")
    @Schema(type = "string", example = "09:00")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    @Schema(type = "string", example = "18:00")
    private LocalTime endTime;

    @JsonFormat(pattern = "HH:mm")
    @Schema(type = "string", example = "01:00")
    private LocalTime breakTime;

    @Schema(description = "반복 요일 (예: MONDAY, TUESDAY)")
    private List<String> repeatDays;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(type = "string", example = "2025-05-31")
    private LocalDate repeatEndDate;

    // 여러 사용자에 대한 스케줄을 생성하는 로직
    public List<Schedule> toEntities(UserRepository userRepository, StoreRepository storeRepository) {
        List<Schedule> schedules = new ArrayList<>();

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeId));

        for (Long userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            Schedule schedule = new Schedule();
            schedule.setUser(user);
            schedule.setStore(store);
            schedule.setWorkDate(workDate);
            schedule.setStartTime(startTime);
            schedule.setEndTime(endTime);
            schedule.setBreakTime(breakTime);
            schedule.setRepeatDaysFromList(repeatDays);
            schedule.setRepeatEndDate(repeatEndDate);
            schedules.add(schedule);
        }
        return schedules;
    }
}
