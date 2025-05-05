package com.example.albaease.user.dto;

import com.example.albaease.auth.CustomUserDetails;
import com.example.albaease.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class UserResponse {

    private final String fullName;
    private final String email;
    private final String role;
    private List<String> storeNames;

    // 생성자에서 User 엔티티를 받아와서 필요한 정보만 추출
    public UserResponse(User user, List<String> storeNames) {
        this.fullName = user.getLastName() + user.getFirstName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.storeNames = storeNames;
    }
}
