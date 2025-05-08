package com.example.albaease.store.controller;

import com.example.albaease.store.dto.StoreRequestDto;
import com.example.albaease.store.dto.StoreResponseDto;
import com.example.albaease.store.dto.StoreUpdateRequestDto;
import com.example.albaease.store.service.StoreService;
import com.example.albaease.store.service.BusinessNumberValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;
    private final BusinessNumberValidator businessNumberValidator;

    // 매장 등록 (사장님)
    @PostMapping
    public ResponseEntity<StoreResponseDto> createStore(
            @Valid @RequestBody StoreRequestDto request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(storeService.createStore(request, username));
    }

    // 매장 정보 조회 (운영 or 근무 전체 매장 조회)
    @GetMapping("/me")
    public ResponseEntity<List<StoreResponseDto>> getMyStore(
            Authentication authentication
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(storeService.getMyStore(username));
    }

    // 매장 정보 수정
    @PutMapping("/{storeId}")
    public ResponseEntity<StoreResponseDto> updateStore(
            @PathVariable Long storeId,
            @Valid @RequestBody StoreUpdateRequestDto request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(storeService.updateStore(storeId, request, username));
    }

    // 매장 삭제
    @DeleteMapping("/{storeId}")
    public ResponseEntity<Void> deleteStore(
            @PathVariable Long storeId,
            Authentication authentication
    ) {
        String username = authentication.getName();
        storeService.deleteStore(storeId, username);
        return ResponseEntity.noContent().build();
    }

    // 사업자등록번호 검증 요청 DTO
    public static class BusinessNumberRequest {
        public String businessNumber;
    }

    // 사업자등록번호 유효성 검증
    @PostMapping("/validate-business-number")
    public ResponseEntity<Boolean> validateBusinessNumber(@RequestBody BusinessNumberRequest request) {
        boolean isValid = businessNumberValidator.validateBusinessNumber(request.businessNumber);
        return ResponseEntity.ok(isValid);
    }
}
