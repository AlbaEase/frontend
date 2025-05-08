package com.example.albaease.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class IdCheckRequest {
    @Schema(description = "현재 이메일 입력", example = "qwer1234@naver.com")
    private String email;
}
