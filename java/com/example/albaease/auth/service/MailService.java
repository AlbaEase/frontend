package com.example.albaease.auth.service;

import com.example.albaease.auth.exception.MailSendFailureException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import com.example.albaease.auth.exception.AuthException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;
    private final StringRedisTemplate redisTemplate;


    //인증번호(랜덤 숫자) 생성
    public String createNumber() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }

    //인증번호 전송
    public void sendVerificationCode(String email) {
        String code = createNumber();
        // Redis에 인증번호 저장, 30분 후 만료
        redisTemplate.opsForValue().set(email + ":verificationCode", code, 30, TimeUnit.MINUTES);
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("인증번호를 입력해주세요");
            helper.setText("알바이즈 인증번호: " + code);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new MailSendFailureException("이메일 전송에 실패했습니다.");
        }
    }

    //인증번호 검증
    public void verifyCode(String email, String code) {
        String storedCode = redisTemplate.opsForValue().get(email + ":verificationCode");
        if (storedCode == null) {
            throw new AuthException("인증번호가 만료되었거나 존재하지 않습니다.");
        }

        if (!storedCode.equals(code)) {
            throw new AuthException("인증번호가 일치하지 않습니다.");
        }
        //인증번호 검증 완료 상태 저장(회원가입시 체크)
        redisTemplate.opsForValue().set(email + ":isVerified", "true", 20, TimeUnit.MINUTES);

        //인증번호 삭제
        redisTemplate.delete(email + ":verificationCode");

    }
}
