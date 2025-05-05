//package com.example.albaease.auth.service;
//
//import com.example.albaease.auth.exception.InvalidVerificationCodeException;
//import com.example.albaease.auth.exception.SmsSendFailureException;
//import jakarta.annotation.PostConstruct;
//import jakarta.servlet.http.HttpSession;
//import net.nurigo.java_sdk.api.Message;
//import net.nurigo.java_sdk.exceptions.CoolsmsException;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.data.redis.core.StringRedisTemplate;
//
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.concurrent.TimeUnit;
//
//@Service
//public class SmsService {
//    private final StringRedisTemplate redisTemplate;
//    private final String apiKey;
//    private final String apiSecret;
//    private final String senderNumber;
//    public SmsService(StringRedisTemplate redisTemplate,
//                      @Value("${coolsms.api.key}") String apiKey,
//                      @Value("${coolsms.api.secret}") String apiSecret,
//                      @Value("${coolsms.api.number}") String senderNumber) {
//        this.redisTemplate = redisTemplate;
//        this.apiKey = apiKey;
//        this.apiSecret = apiSecret;
//        this.senderNumber = senderNumber;
//    }
//
//
//    // 인증번호 전송
//    public boolean sendVerificationCode(String phoneNumber, HttpSession session) throws CoolsmsException {
//        String verificationCode = generateVerificationCode();
//        session.setAttribute("phoneNumber", phoneNumber);
//        // Redis에 인증번호 저장, 10분 후 만료
//        redisTemplate.opsForValue().set(phoneNumber, verificationCode, 10, TimeUnit.MINUTES);
//        try{
//            // CoolSMS API를 통해 SMS 전송
//            Message coolsms = new Message(apiKey, apiSecret);
//            HashMap<String, String> message = new HashMap<>();
//            message.put("to", phoneNumber);
//            message.put("from", senderNumber);
//            message.put("text", "알바이즈 인증번호: " + verificationCode);
//            coolsms.send(message);
//        } catch (CoolsmsException e) {
//            throw new SmsSendFailureException(e.getMessage());
//        }
//
//        return true;
//    }
//
//    // 인증번호 생성 (6자리 숫자)
//    private String generateVerificationCode() {
//        return String.format("%06d", (int) (Math.random() * 1000000));
//    }
//
//    // 인증번호 검증
//    public boolean verifyCode(String phoneNumber, String verificationCode, HttpSession session) {
//        String storedCode = redisTemplate.opsForValue().get(phoneNumber);
//
//        if (storedCode == null) {
//            throw new InvalidVerificationCodeException("인증번호가 만료되었거나 존재하지 않습니다.");
//        }
//
//        if (!storedCode.equals(verificationCode)) {
//            throw new InvalidVerificationCodeException("인증번호가 일치하지 않습니다.");
//        }
//
//        // 인증 성공 시
////        session.setAttribute("VERIFIED_PHONE_" + phoneNumber, true); // 먼저 저장
//        redisTemplate.delete(phoneNumber);  // 그 다음 인증번호 삭제
//
//        // 로그는 setAttribute 후에 찍기
////        System.out.println("Phone verification success. Session ID: " + session.getId());
////        System.out.println("isPhoneVerified in session: " + session.getAttribute("isPhoneVerified"));
//
//        return true;
//    }
//}
