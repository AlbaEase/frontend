package com.example.albaease.modification.dto;

import com.example.albaease.modification.domain.entity.Modification;
import com.example.albaease.modification.domain.enums.ModificationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ModificationResponse {
    private Long id;
    private Long userId;
    private Long scheduleId;
    private String details;
    private ModificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ModificationResponse from(Modification modification) {
        return ModificationResponse.builder()
                .id(modification.getModification_id())
                .userId(modification.getUser().getUserId())
                .scheduleId(modification.getSchedule().getScheduleId())
                .details(modification.getDetails())
                .status(modification.getStatus())
                .createdAt(modification.getCreatedAt())
                .updatedAt(modification.getUpdatedAt())
                .build();
    }
}
