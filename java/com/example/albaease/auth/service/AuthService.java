package com.example.albaease.auth.service;
import com.example.albaease.auth.CustomUserDetails;
import com.example.albaease.auth.dto.*;
import com.example.albaease.user.dto.PasswordChangeRequest;
import com.example.albaease.user.entity.SocialType;
import com.example.albaease.user.entity.User;
import com.example.albaease.user.repository.UserRepository;
import com.example.albaease.auth.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import com.example.albaease.auth.exception.AuthException;
import com.example.albaease.auth.exception.ValidationException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final MailService mailService;

    //회원가입 메서드
    public void signup(SignupRequest request) {
        String email = request.getEmail();
        //이메일 중복검사 체크
        String idChecked = redisTemplate.opsForValue().get(email + ":idChecked");
        if (idChecked == null) {
            throw new ValidationException("이메일 중복검사를 먼저 진행해주세요");
        }
        //이메일 인증 체크
        String isVerified = redisTemplate.opsForValue().get(email + ":isVerified");
        if (isVerified == null) {
            throw new ValidationException("이메일 인증을 먼저 진행해주세요");
        }
        // 비밀번호 확인 추가 (비밀번호와 비밀번호 확인 필드가 있다고 가정)
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("비밀번호가 일치하지 않습니다.");
        }

        // 소셜 로그인을 위한 socialType 설정
        SocialType socialType = "kakao".equals(request.getSocialType()) ? SocialType.KAKAO : SocialType.NONE;

        // 비밀번호 암호화 후 저장
        User user = new User(
                request.getLastName(),
                request.getFirstName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),  // BCrypt 암호화
                socialType,
                request.getRole(),
                null,  // store는 일단 null
                null   // businessNumber도 null
        );
        // 사용자 정보를 DB에 저장
        userRepository.save(user);
        redisTemplate.delete(email + ":idChecked");
        redisTemplate.delete(email + ":isVerified");
    }
    //로그인 메서드
    public LoginResponse login(LoginRequest request) {
        //로그인아이디로 사용자 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("유저를 찾을 수 없습니다."));

        // 비밀번호 검증 -> 입력받은 비번이랑 저장된 비번이랑 같은지 비교
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("비밀번호가 일치하지 않습니다.");
        }

        // JWT 발급 -> 비밀번호가 일치하면 JWT 토큰을 발급하여 반환
        String token =  jwtUtil.generateToken(user.getUserId().toString(), user.getRole().toString());
        // 풀네임 받아옴
        String fullName = user.getLastName() + user.getFirstName();
        // CustomUserDetails 객체 생성
        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        System.out.println("로그인에서 제대로 객체생성하는지 확인" + customUserDetails);
        // Authentication 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                customUserDetails, null, customUserDetails.getAuthorities());

        System.out.println("로그인에서 제대로 객체생성하는지 확인2" + authentication);

        // SecurityContext에 Authentication 객체 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // JWT 콘솔 출력 확인(나중에 지울거)
        System.out.println("Generated JWT: " + token);
        // 로그인 응답 반환
        return new LoginResponse(token, user.getRole().toString(), fullName);
    }

    //이메일 중복 검사
    public void checkIdDuplicate(IdCheckRequest request) {
        String email = request.getEmail();
        // ID 중복 검사
        if (userRepository.existsByEmail(email)) {
            throw new ValidationException("이미 존재하는 이메일입니다.");
        }
        // 이메일 중복 검사를 완료상태 저장(회원가입시 체크)
        redisTemplate.opsForValue().set(email + ":idChecked", "true", 20, TimeUnit.MINUTES);
    }
    //현재 비밀번호 확인
    public void verifyCurrentPassword(VerifyPasswordRequest request, String token) {
        //토큰을 통해 userId 가져옴
        Long userId = Long.valueOf(jwtUtil.extractUserId(token));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("유저를 찾을 수 없습니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ValidationException("비밀번호가 일치하지 않습니다.");
        }
        // 정보수정 클릭시 비밀번호 확인 기록 저장
        redisTemplate.opsForValue().set("passwordChecked:" + userId, "true", 10, TimeUnit.MINUTES);

    }


    //로그아웃
    public void logout(String token) {
        Long expiration = jwtUtil.extractExpirationDate(token).getTime();
        if (expiration == null) {
            throw new IllegalStateException("토큰 정보를 가져올 수 없습니다.");
        }

        // Redis에 블랙리스트 저장 (key: blacklist:토큰, value: "true", TTL: expiration)
        redisTemplate.opsForValue().set("blacklist:" + token, "true", expiration, TimeUnit.MILLISECONDS);
    }


}

