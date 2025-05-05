package com.example.albaease.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordChangeRequest {
    @Schema(description = "변경할 비밀번호 입력", example = "qwer1234")
    private String newPassword;
    @Schema(description = "변경할 비밀번호 입력", example = "qwer1234")
    private String confirmNewPassword;
}
