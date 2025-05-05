package com.example.albaease.user.service;

import com.example.albaease.auth.CustomUserDetails;
import com.example.albaease.auth.dto.MailRequest;
import com.example.albaease.auth.dto.VerifyMailRequest;
import com.example.albaease.user.dto.PasswordChangeRequest;
import com.example.albaease.auth.exception.AuthException;
import com.example.albaease.auth.exception.ValidationException;
import com.example.albaease.auth.jwt.JwtUtil;
import com.example.albaease.auth.service.MailService;
import com.example.albaease.user.dto.NameChangeRequest;
import com.example.albaease.user.dto.UserResponse;
import com.example.albaease.user.entity.User;
import com.example.albaease.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    //유저정보 불러오기
    public UserResponse getCurrentUser(CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new AuthException("유저를 찾을 수 없습니다."));

        List<String> storeNames = user.getUserStoreRelationships().stream()
                .map(relationship -> relationship.getStore().getName())
                .collect(Collectors.toList());

        return new UserResponse(user, storeNames);
    }


    /////이메일 변경

    // 변경할 이메일 요청 및 인증 코드 발송
    public void requestEmailChange(String token, MailRequest request) {
        Long userId = Long.valueOf(jwtUtil.extractUserId(token));
        String verified = redisTemplate.opsForValue().get("passwordChecked:" + userId);
        if (!"true".equals(verified)) throw new ValidationException("먼저 비밀번호를 확인해주세요.");
        if (userRepository.existsByEmail(request.getEmail())) throw new ValidationException("이미 사용 중인 이메일입니다.");

        mailService.sendVerificationCode(request.getEmail());
    }

    // 인증 코드 검증 및 이메일 변경 완료
    public void verifyNewEmailAndChange(String token, VerifyMailRequest request) {
        Long userId = Long.valueOf(jwtUtil.extractUserId(token));
        String storedCode = redisTemplate.opsForValue().get(request.getEmail() + ":verificationCode");
        if (storedCode == null || !storedCode.equals(request.getVerificationCode())) {
            throw new AuthException("인증번호가 올바르지 않습니다.");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new AuthException("유저를 찾을 수 없습니다."));
        user.changeEmail(request.getEmail());
        userRepository.save(user);
        redisTemplate.delete(request.getEmail() + ":verificationCode");
    }

    //비밀번호 변경
    public void changePassword(String token, PasswordChangeRequest request){
        Long userId = Long.valueOf(jwtUtil.extractUserId(token));
        String isPasswordChecked = redisTemplate.opsForValue().get("passwordChecked:" + userId);
        if (!"true".equals(isPasswordChecked)) throw new ValidationException("비밀번호 확인이 필요합니다.");

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) throw new ValidationException("비밀번호가 일치하지 않습니다.");

        User user = userRepository.findById(userId).orElseThrow(() -> new AuthException("유저를 찾을 수 없습니다."));
        user.changePassword(request.getNewPassword(), passwordEncoder);
        userRepository.save(user);
    }
    //이름 변경
    public void changeName(String token, NameChangeRequest request){
        Long userId = Long.valueOf(jwtUtil.extractUserId(token));
        String isPasswordChecked = redisTemplate.opsForValue().get("passwordChecked:" + userId);
        if (!"true".equals(isPasswordChecked)) throw new ValidationException("비밀번호 확인이 필요합니다.");

        User user = userRepository.findById(userId).orElseThrow(() -> new AuthException("유저를 찾을 수 없습니다."));
        user.changeName(request.getNewFirstName(), request.getNewLastName());
        userRepository.save(user);
    }

    public void completeEdit(String token) {
        Long userId = Long.valueOf(jwtUtil.extractUserId(token));
        redisTemplate.delete("passwordChecked:" + userId);
    }


}
