package com.example.albaease.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreRequestDto {
    @NotBlank(message = "매장명은 필수입니다.")
    private String name;

    private String location;

    @Pattern(regexp = "^\\d{10}$", message = "사업자등록번호는 10자리 숫자여야 합니다.")
    @NotBlank(message = "사업자등록번호는 필수입니다.")
    private String businessNumber;

    // 엔티티의 storeCode 필드 추가
    private String storeCode;

    // 승인 여부 필드 추가 (기본값 false)
    private Boolean requireApproval = false;
}
