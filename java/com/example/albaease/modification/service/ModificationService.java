package com.example.albaease.modification.service;

import com.example.albaease.modification.domain.entity.Modification;
import com.example.albaease.modification.domain.enums.ModificationStatus;
import com.example.albaease.modification.dto.ModificationRequest;
import com.example.albaease.modification.dto.ModificationResponse;
import com.example.albaease.modification.repository.ModificationRepository;
import com.example.albaease.notification.domain.enums.NotificationType;
import com.example.albaease.notification.dto.NotificationResponse;
import com.example.albaease.notification.handler.WebSocketHandler;
import com.example.albaease.notification.service.NotificationService;
import com.example.albaease.notification.dto.NotificationRequest;
import com.example.albaease.schedule.domain.Schedule;
import com.example.albaease.schedule.repository.ScheduleRepository;
import com.example.albaease.user.entity.User;
import com.example.albaease.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModificationService {
    private final ModificationRepository modificationRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final WebSocketHandler webSocketHandler;

    @Transactional
    public ModificationResponse createModification(ModificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
         .orElseThrow(() -> new EntityNotFoundException("스케줄을 찾을 수 없습니다."));

        Modification modification = Modification.builder()
                .user(user)
                //.schedule(schedule)
                .details(request.getDetails())
                .build();

        Modification savedModification = modificationRepository.save(modification);

        notificationService.createNotification(NotificationRequest.builder()
                .userId(user.getUserId())
                .type(NotificationType.SPECIFIC_USER)
                .message("근무 시간 수정 요청이 도착했습니다.")
                .scheduleId(schedule.getScheduleId())
                .build());

        return ModificationResponse.from(savedModification);
    }

    // 수정 요청 상태 업데이트
    @Transactional
    public ModificationResponse updateModificationStatus(Long modificationId, ModificationStatus status) {
        Modification modification = modificationRepository.findById(modificationId)
                .orElseThrow(() -> new EntityNotFoundException("수정 요청을 찾을 수 없습니다."));

        modification.updateStatus(status);

        String statusMessage = switch (status) {
            case APPROVED -> "근무시간 수정 요청이 승인되었습니다.";
            case REJECTED -> "근무시간 수정 요청이 거절되었습니다.";
            default -> "근무시간 수정 요청 상태가 변경되었습니다.";
        };

        // 상태 변경 알림 전송
        webSocketHandler.sendModificationStatusUpdate(
                modification.getUser().getUserId(),
                statusMessage
        );

        notificationService.createNotification(NotificationRequest.builder()
                .userId(modification.getUser().getUserId())
                .type(NotificationType.SPECIFIC_USER)
                .message(statusMessage)
                .scheduleId(modification.getSchedule().getUserId())
                .build());

        return ModificationResponse.from(modification);
    }

    @Transactional
    public NotificationResponse handleModificationRequest(ModificationRequest request) {
        // 수정 요청 저장
        ModificationResponse modificationResponse = createModification(request);

        // 알림 생성 요청 (Modification에 필요한 필드만 포함)
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .userId(request.getUserId())
                .type(NotificationType.SPECIFIC_USER)
                .message("근무 시간 수정 요청이 도착했습니다.")
                .scheduleId(request.getScheduleId())
                .details(request.getDetails())  // 수정 요청에만 필요한 필드
                .build();

        // Modification 전용 알림 생성 및 반환
        return notificationService.createModificationNotification(notificationRequest, modificationResponse);
    }
    
    // 추후 필요하면 주석 해제 예정
    /*
    // 단일 수정 요청 조회
    public ModificationResponse getModification(Long modificationId) {
        return ModificationResponse.from(modificationRepository.findById(modificationId)
                .orElseThrow(() -> new EntityNotFoundException("수정 요청을 찾을 수 없습니다.")));
    }

    // 사용자별 수정 요청 목록 조회
    public List<ModificationResponse> getUserModifications(Long userId) {
        return modificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ModificationResponse::from)
                .collect(Collectors.toList());
    }

    // 스케줄별 수정 요청 목록 조회
    public List<ModificationResponse> getScheduleModifications(Long scheduleId) {
        return modificationRepository.findByScheduleIdOrderByCreatedAtDesc(scheduleId).stream()
                .map(ModificationResponse::from)
                .collect(Collectors.toList());
    }
*/

}
