package com.example.albaease.modification.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ModificationRequest {
    private Long userId;
    private Long scheduleId;
    private String details;

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
