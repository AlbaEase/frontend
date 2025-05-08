package com.example.albaease.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyMailRequest {
    @Schema(example = "user@naver.com")
    private String email;

    @Schema(example = "123456")
    private String verificationCode;
}
