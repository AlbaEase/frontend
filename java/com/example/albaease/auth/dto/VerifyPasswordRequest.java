package com.example.albaease.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VerifyPasswordRequest {
    @Schema(description = "현재 비밀번호 입력", example = "qwer1234")
    private String currentPassword;
}
