package com.example.albaease.user.entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum Role {
    OWNER,   // 사장님
    WORKER   // 알바생
}
