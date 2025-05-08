package com.example.albaease.schedule.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long templateId; // 템플릿 ID

    // api테스트용, 병합 후 삭제 해야함
    private Long storeId; // 임시 스토어 아이디

    @Column(nullable = false)
    private String templateName; // 템플릿 이름

    @Column(nullable = false)
    private LocalTime startTime; // 근무 시작 시간

    @Column(nullable = false)
    private LocalTime endTime; // 근무 종료 시간

    @Column(nullable = false)
    private LocalTime breakTime; // 휴게 시간
}
