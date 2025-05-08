package com.example.albaease.schedule.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TemplateRequest {
    private Long storeId;
    private String templateName;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime breakTime;
}
