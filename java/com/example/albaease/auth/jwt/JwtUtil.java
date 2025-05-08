package com.example.albaease.auth.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")  // application.yml에서 설정한 비밀 키를 가져옴
    private String secretKey;

    private final long validityInMilliseconds = 3600000;  // JWT 유효 기간 (1시간)


    // JWT 토큰 생성
    public String generateToken(String userId, String role) {

        String token = Jwts.builder()
                .setSubject(userId)  // 토큰에 저장할 사용자 정보
                .claim("role", role)  // 사용자 역할
                .setIssuedAt(new Date())  // 토큰 발급 시간
                .setExpiration(new Date(System.currentTimeMillis() + validityInMilliseconds))  // 만료 시간 (1시간)
                .signWith(SignatureAlgorithm.HS256, secretKey)  // 서명
                .compact();
        // 생성된 토큰 출력
        System.out.println("Generated Token: " + token);
        return token;
    }


    // JWT 토큰에서 사용자 ID 추출
    public String extractUserId(String token) {

        // Bearer 부분을 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);  // "Bearer "의 길이 7을 잘라냄
        }

        String userId = Jwts.parser()
                .setSigningKey(secretKey) // 서명에 사용된 비밀 키 저장
                .parseClaimsJws(token) // 토큰을 파싱해서 jws 클레임 추출
                .getBody() // 클레이 바디 부분 가져옴
                .getSubject(); // userId저장된 subject 값 반환

        return userId;
    }

    // JWT 토큰 만료여부 확인
    public boolean isTokenExpired(String token) {
        //만료시간, 현재시간 비교해서 만료되었는지 확인
        return extractExpirationDate(token).before(new Date());
    }
    //jwt 토큰에서 만료시간 추출함
    public Date extractExpirationDate(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}
