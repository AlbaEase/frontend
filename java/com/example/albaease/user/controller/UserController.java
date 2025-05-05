package com.example.albaease.user.controller;

import com.example.albaease.auth.CustomUserDetails;
import com.example.albaease.auth.dto.MailRequest;
import com.example.albaease.auth.dto.VerifyMailRequest;
import com.example.albaease.user.dto.NameChangeRequest;
import com.example.albaease.user.dto.PasswordChangeRequest;
import com.example.albaease.user.dto.UserResponse;
import com.example.albaease.user.entity.User;
import com.example.albaease.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 개인정보 확인
    @Operation(summary = "내 정보 조회", description = "로그인한 사용자의 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "정보 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUserInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        // 서비스에서 사용자 정보 가져오기
        UserResponse userResponse = userService.getCurrentUser(userDetails);
//        // userResponse가 제대로 값이 들어있는지 확인
//        System.out.println("userResponse: " + userResponse.getEmail());
//        System.out.println("userResponse: " + userResponse.getFullName());
//        System.out.println("userResponse: " + userResponse.getRole());
//        System.out.println("userResponse: " + userResponse.getStoreName());

         // 성공적으로 사용자 정보를 가져왔으면 반환
        return ResponseEntity.ok(userResponse);
    }
    @Operation(summary = "이메일 변경 - 인증 코드 발송")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드 발송 성공"),
            @ApiResponse(responseCode = "400", description = "현재 비밀번호 확인 안 됨 또는 이미 사용 중인 이메일"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/change-email")
    public ResponseEntity<String> changeEmail(@RequestBody MailRequest request,
                                              @RequestHeader(value = "Authorization", required = false) String token) {
        userService.requestEmailChange(token, request);
        return ResponseEntity.ok("변경할 이메일로 인증 코드가 발송되었습니다.");
    }

    @Operation(summary = "이메일 변경 - 인증 코드 검증 및 저장")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이메일 변경 성공"),
            @ApiResponse(responseCode = "400", description = "인증번호 불일치 또는 이메일 오류"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping("/verify-new-email")
    public ResponseEntity<String> verifyNewEmail(@RequestBody VerifyMailRequest request,
                                                 @RequestHeader(value = "Authorization", required = false) String token) {
        userService.verifyNewEmailAndChange(token, request);
        return ResponseEntity.ok("이메일이 성공적으로 변경되었습니다.");
    }

    @Operation(summary = "비밀번호 변경", description = "비밀번호 변경을 진행합니다.(변경 전에 현재 비밀번호 확인 진행해야함)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공"),
            @ApiResponse(responseCode = "400", description = "비밀번호 체크 안 함 또는 비밀번호 불일치"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PatchMapping("/password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request,
                                                 @RequestHeader(value = "Authorization", required = false) String token) {
        userService.changePassword(token, request);
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }

    @Operation(summary = "이름 변경")
    @PatchMapping("/name")
    public ResponseEntity<String> changeName(@RequestBody NameChangeRequest request,
                                             @RequestHeader(value = "Authorization", required = false) String token) {
        userService.changeName(token, request);
        return ResponseEntity.ok("이름이 성공적으로 변경되었습니다.");
    }

    @Operation(summary = "수정 완료 - Redis 삭제")
    @PostMapping("/complete-edit")
    public ResponseEntity<String> completeEdit(@RequestHeader(value = "Authorization", required = false) String token) {
        userService.completeEdit(token);
        return ResponseEntity.ok("수정이 완료되었습니다.");
    }


}
