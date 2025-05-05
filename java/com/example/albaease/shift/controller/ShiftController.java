package com.example.albaease.shift.controller;

import com.example.albaease.notification.dto.NotificationResponse;
import com.example.albaease.shift.domain.enums.ShiftStatus;
import com.example.albaease.shift.dto.ShiftRequest;
import com.example.albaease.shift.dto.ShiftResponse;
import com.example.albaease.shift.service.ShiftService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;

    // 대타 요청 생성
    @PostMapping("/shift-requests/store/{storeId}")
    public ResponseEntity<ShiftResponse> createShiftRequest(
            @RequestBody ShiftRequest request,
            Principal principal) {
        String userId = principal.getName();
        request.setFromUserId(Long.parseLong(userId));

        // requestDate는 request 객체에서 이미 포함되어 있음

        return ResponseEntity.ok(shiftService.createShiftRequest(request));
    }

    // 대타 요청 상태 업데이트
    @PatchMapping("/shift-requests/{shiftId}/status")
    public ResponseEntity<ShiftResponse> updateStatus(
            @PathVariable Long shiftId,
            @RequestParam ShiftStatus status,
            Principal principal) {
        String approverId = principal.getName();
        return ResponseEntity.ok(shiftService.updateShiftStatus(
                shiftId,
                status,
                Long.parseLong(approverId))
        );
    }

    // WebSocket을 통해 알림 전송
    @MessageMapping("/shift-requests")
    @SendToUser("/queue/notifications")
    public NotificationResponse handleShiftRequest(
            ShiftRequest request,
            Principal principal) {
        String userId = principal.getName();
        request.setFromUserId(Long.parseLong(userId));
        return shiftService.handleShiftRequest(request);
    }
}
