package com.example.albaease.auth;

import com.example.albaease.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter

public class CustomUserDetails implements UserDetails {
    private final User user;

    // 생성자
    public CustomUserDetails(User user) {
        this.user = user;
    }

    // 권한 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    // 비밀번호 반환
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // username = loginId = email
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // 계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠김 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 자격 증명(비밀번호) 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 사용자 활성화 여부
    @Override
    public boolean isEnabled() {
        return true;
    }

    // 유저 ID (DB 기본키)
    public Long getUserId() {
        return user.getUserId();
    }

    // 사용자 풀네임 반환
    public String getFullName() {
        return user.getLastName() + user.getFirstName();
    }

    // 유저 Role 반환 (String 으로)
    public String getRole() {
        return user.getRole().name();
    }

    //  매장 이름 반환
    public List<String> getStoreNames() {
            return user.getUserStoreRelationships().stream()
                    .map(relationship -> relationship.getStore().getName())
                    .collect(Collectors.toList());
        }
}
