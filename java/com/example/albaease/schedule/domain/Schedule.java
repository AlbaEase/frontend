package com.example.albaease.schedule.domain;

import com.example.albaease.store.domain.Store;
import com.example.albaease.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    // Store와의 관계 추가
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime breakTime;

    @Column(name = "repeat_days")
    private String repeatDays;

    @Column(name = "repeat_end_date")
    private LocalDate repeatEndDate;

    // 기존 메서드들 유지
    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }

    // Store ID를 가져오는 메서드 추가
    public Long getStoreId() {
        return store != null ? store.getId() : null;
    }

    public List<String> getRepeatDaysList() {
        return repeatDays != null ? Arrays.asList(repeatDays.split(",")) : Collections.emptyList();
    }

    public void setRepeatDaysFromList(List<String> days) {
        this.repeatDays = days != null ? String.join(",", days) : null;
    }
}
