package com.example.albaease.shift.repository;

import com.example.albaease.shift.domain.entity.Shift;
import com.example.albaease.shift.domain.enums.ShiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    // 특정 월에 승인된 대타 요청 조회 메서드 (추가)
    @Query("SELECT s FROM Shift s WHERE s.status = :status " +
            "AND YEAR(s.requestDate) = :year AND MONTH(s.requestDate) = :month")
    List<Shift> findApprovedShiftsForMonth(
            @Param("status") ShiftStatus status,
            @Param("year") int year,
            @Param("month") int month);
}
