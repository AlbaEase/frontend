package com.example.albaease.user.entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum SocialType {
    KAKAO,   // 카카오 로그인
    NONE     // 소셜 로그인 없이 일반 회원가입
}
