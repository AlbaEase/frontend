package com.example.albaease.store.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreResponseDto {

    private Long id; // 엔티티의 id 추가
    private Long storeId;
    private String storeCode;
    private String businessNumber;
    private String name;
    private String location;

    // 엔티티의 승인 여부 필드 추가
    private Boolean requireApproval;

    private LocalDateTime createdAt;

}
