package com.example.albaease.modification.repository;

import com.example.albaease.modification.domain.entity.Modification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository
@Repository
public interface ModificationRepository extends JpaRepository<Modification, Long> {

    List<Modification> findByUser_UserIdOrderByCreatedAtDesc(Long userId);


    // 스케줄별 수정 요청 목록 조회 (생성일시 기준 내림차순)
   // List<Modification> findByScheduleIdOrderByCreatedAtDesc(Long scheduleId);
}
