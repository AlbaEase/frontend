package com.example.albaease.auth.jwt;

import com.example.albaease.auth.CustomUserDetails;
import com.example.albaease.auth.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final StringRedisTemplate redisTemplate;

    private static final List<String> PERMIT_ALL_PATHS = Arrays.asList(
            "/user/",
            "/swagger-ui.html",
            "/swagger-ui/",
            "/v3/api-docs/",
            "/swagger-resources/",
            "/webjars/",
            "/store/validate-business-number",
            "/ws/"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromRequest(request);
        logger.info("doFilterInternal  Extracted token: " + token);
        // 블랙리스트 확인
        if (token != null && redisTemplate.hasKey("blacklist:" + token)) {
            logger.warn("토큰이 블랙리스트에 포함되어 있음. 요청 차단.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 401
            return;
        }
        if (token != null && !jwtUtil.isTokenExpired(token)) {
            String userId = jwtUtil.extractUserId(token);
            logger.info("doFilterInternal  Extracted userId: " + userId);

            CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserById(Long.valueOf(userId));
            var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return null;
    }
}
