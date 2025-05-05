package com.example.albaease.schedule.dto;

import com.example.albaease.schedule.domain.Template;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Getter
public class TemplateResponse {
    private Long templateId;
    private Long storeId;
    private String templateName;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime breakTime;

    public TemplateResponse(Template template) {
        this.templateId = template.getTemplateId();
        this.storeId = template.getStoreId();
        this.templateName = template.getTemplateName();
        this.startTime = template.getStartTime();
        this.endTime = template.getEndTime();
        this.breakTime = template.getBreakTime();
    }

}
