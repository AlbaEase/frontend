package com.example.albaease.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @Schema(description = "아이디 입력", example = "qwer1234@naver.com")
    private String email;
    @Schema(description = "비밀번호 입력", example = "qwer1234")
    private String password;
}
