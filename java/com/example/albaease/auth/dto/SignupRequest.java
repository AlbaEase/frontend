package com.example.albaease.auth.dto;

import com.example.albaease.user.entity.Role;
import com.example.albaease.user.entity.SocialType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
    @Schema(description = "소셜 로그인 유형", example = "NONE")
    private SocialType socialType;
    @Schema(description = "성",  example = "김")
    private String lastName;
    @Schema(description = "아름",  example = "시현")
    private String firstName;
    @Schema(description = "이메일",  example = "qwer1234")
    private String email;
    @Schema(description = "비밀번호",  example = "qwer1234")
    private String password;
    @Schema(description = "비밀번호 확인",  example = "qwer1234")
    private String confirmPassword; // 비밀번호 확인
//    @Schema(description = "전화번호",  example = "01012341234")
//    private String phoneNumber;
    @Schema(description = "역할 선택",  example = "OWNER")
    private Role role;
}
