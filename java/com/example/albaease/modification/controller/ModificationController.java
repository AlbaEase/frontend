package com.example.albaease.modification.controller;

import com.example.albaease.modification.domain.enums.ModificationStatus;
import com.example.albaease.modification.dto.ModificationRequest;
import com.example.albaease.modification.dto.ModificationResponse;
import com.example.albaease.modification.service.ModificationService;
import com.example.albaease.notification.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ModificationController {
    private final ModificationService modificationService;

    // 근무시간 수정 요청
    @PostMapping("/shift-modification/store/{storeId}")
    public ResponseEntity<ModificationResponse> createModification(
            @RequestBody ModificationRequest request,
            Principal principal) {
        String userId = principal.getName();
        request.setUserId(Long.parseLong(userId));
        return ResponseEntity.ok(modificationService.createModification(request));
    }

    // 수정 요청 상태 업데이트, 사용자가 (승인/거절)버튼 클릭 시
    @PatchMapping("/shift-modification/{modificationId}/status")
    public ResponseEntity<ModificationResponse> updateStatus(
            @PathVariable Long modificationId,
            @RequestParam ModificationStatus status) {
        return ResponseEntity.ok(modificationService.updateModificationStatus(modificationId, status));
    }

    // WebSocket을 통해 알림 전송
    @MessageMapping("/modification")
    @SendToUser("/queue/notifications")
    public NotificationResponse handleModificationRequest(
            ModificationRequest request,
            Principal principal) {
        String userId = principal.getName();
        request.setUserId(Long.parseLong(userId));
        return modificationService.handleModificationRequest(request);
    }
}
