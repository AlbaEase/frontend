package com.example.albaease.auth.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // ValidationException : 유효성 검사 실패 (중복, 사전 체크, 비밀번호 불일치 등)
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<String> handleValidationException(ValidationException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST); // 400 Bad Request
    }

    // AuthException : 인증 실패 (자격 증명, 인증번호 불일치 등)
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<String> handleAuthException(AuthException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
    }

    // MailSendFailureException : 메일 전송 실패
    @ExceptionHandler(MailSendFailureException.class)
    public ResponseEntity<String> handleMailSendFailureException(MailSendFailureException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
    }
}
