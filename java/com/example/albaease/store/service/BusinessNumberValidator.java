package com.example.albaease.store.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class BusinessNumberValidator {

    private static final String API_URL_VALIDATE = "https://api.odcloud.kr/api/nts-businessman/v1/validate";
    // 디코딩(Decoding) 키로 반영
    private static final String SERVICE_KEY = "b6dcFOjS9A6AVjlsEzyBBFa+k6XpLrC3j1uo8U1IaLG/WeWSbbDHq+fUtEyFyPk3e+OPMx6HXC8NEU5wL3y4Ng==";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean validateBusinessNumber(String businessNumber) {
        try {
            // 하이픈 제거
            String cleanBusinessNumber = businessNumber.replace("-", "");
            log.info("Validating business number: {}", cleanBusinessNumber);

            // 요청 데이터 생성
            Map<String, String> business = new HashMap<>();
            business.put("b_no", cleanBusinessNumber);
            business.put("start_dt", "");
            business.put("p_nm", "");
            business.put("p_nm2", "");
            business.put("b_nm", "");
            business.put("corp_no", "");
            business.put("b_sector", "");
            business.put("b_type", "");
            business.put("b_adr", "");

            List<Map<String, String>> businesses = new ArrayList<>();
            businesses.add(business);

            Map<String, Object> requestData = new HashMap<>();
            requestData.put("businesses", businesses);

            String requestBody = objectMapper.writeValueAsString(requestData);
            log.info("Request body: {}", requestBody);

            // 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            // 요청 엔티티 설정
            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

            // API 호출
            String requestUrl = API_URL_VALIDATE + "?serviceKey=" + SERVICE_KEY + "&returnType=JSON";
            log.info("Request URL: {}", requestUrl);

            ResponseEntity<Map> responseEntity = restTemplate.exchange(requestUrl, HttpMethod.POST, requestEntity, Map.class);
            log.info("Response status: {}", responseEntity.getStatusCode());
            log.info("Response body: {}", responseEntity.getBody());

            // 응답 데이터 파싱
            Map<String, Object> responseBody = responseEntity.getBody();
            if (responseBody != null && responseBody.containsKey("data")) {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");
                if (!dataList.isEmpty()) {
                    Map<String, Object> data = dataList.get(0);
                    return "01".equals(data.get("valid"));
                }
            }
        } catch (Exception e) {
            log.error("Error validating business number: {}", e.getMessage(), e);
        }
        return false;
    }
}
