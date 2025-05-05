package com.example.albaease.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NameChangeRequest {
    @Schema(description = "변경할 이름 입력", example = "시현")
    private String newFirstName;
    @Schema(description = "변경할 성 입력", example = "김")
    private String newLastName;
}
