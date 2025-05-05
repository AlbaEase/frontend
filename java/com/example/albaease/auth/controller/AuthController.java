package com.example.albaease.auth.controller;

import com.example.albaease.auth.dto.*;
import com.example.albaease.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.example.albaease.auth.exception.AuthException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    //스웨거 어노테이션
    @Operation(summary = "회원가입", description = "사용자가 회원가입을 요청합니다.(가입전에 아이디 중복검사, 이메일 인증 진행해야함)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "요청 오류 - 이메일 중복 체크 안 함, 이메일 인증 안 함, 비밀번호 불일치"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        // session 파라미터 추가
        authService.signup(request);
        return ResponseEntity.ok("회원 가입 성공");
    }

    //스웨거 어노테이션
    @Operation(summary = "로그인", description = "사용자가 로그인 후 JWT 토큰을 요청합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공, JWT 토큰 반환"),
            @ApiResponse(responseCode = "401", description = "인증 실패 - 이메일 또는 비밀번호 불일치")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request)  {

        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    //아이디 중복체크
    @Operation(summary = "이메일 중복 체크",description = "회원가입 전 이메일 중복 체크를 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용 가능한 이메일입니다."),
            @ApiResponse(responseCode = "400", description = "이미 존재하는 이메일입니다.")
    })
    @PostMapping("/check-id")
    public ResponseEntity<String> checkId(@RequestBody IdCheckRequest request) {
        authService.checkIdDuplicate(request);
        return ResponseEntity.ok("사용 가능한 이메일입니다.");

    }

    //비밀번호 확인
    @Operation(summary = "현재 비밀번호 확인", description = "비밀번호 확인을 진행합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 확인 완료"),
            @ApiResponse(responseCode = "401", description = "비밀번호 불일치")
    })
    @PostMapping("/verify-password")
    public ResponseEntity<String> verifyPassword(@RequestBody VerifyPasswordRequest request, @RequestHeader(value = "Authorization",required = false) String token) {
        authService.verifyCurrentPassword(request, token);
        return ResponseEntity.ok("비밀번호 확인 완료");
    }

    //로그아웃


}
