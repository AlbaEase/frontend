package com.example.albaease.schedule.repository;

import com.example.albaease.schedule.domain.Schedule;
import com.example.albaease.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // 스토어별 스케줄 조회 (Store 객체 기반)
    List<Schedule> findByStore_Id(Long storeId);

    // 특정 사용자의 스케줄 목록 조회
    List<Schedule> findByUser(User user);

    // 특정 날짜의 스케줄 조회
    List<Schedule> findByWorkDate(LocalDate workDate);

    // 특정 스토어와 사용자의 스케줄 조회
    List<Schedule> findByStore_IdAndUser_UserId(Long storeId, Long userId);
}
