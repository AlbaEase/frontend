package com.example.albaease.store.service;

import com.example.albaease.store.dto.StoreResponseDto;
import com.example.albaease.store.domain.Store;
import com.example.albaease.store.domain.UserStoreRelationship;
import com.example.albaease.store.repository.StoreRepository;
import com.example.albaease.store.repository.UserStoreRelationshipRepository;
import com.example.albaease.store.dto.StoreRequestDto;
import com.example.albaease.store.dto.StoreUpdateRequestDto;
import com.example.albaease.user.entity.User;
import com.example.albaease.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final UserStoreRelationshipRepository userStoreRelationshipRepository;
    private final BusinessNumberValidator businessNumberValidator;

    @Transactional
    public StoreResponseDto createStore(StoreRequestDto request, String loginId) {

        // 사업자등록번호 검증
        boolean isValidBusinessNumber = businessNumberValidator.validateBusinessNumber(request.getBusinessNumber());

        // 사용자 조회
        User user = userRepository.findByEmail(loginId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 랜덤 매장 코드 생성
        String storeCode = generateRandomStoreCode();

        // 매장 생성
        Store store = Store.builder()
                .name(request.getName())
                .location(request.getLocation())
                .require_approval(isValidBusinessNumber)
                .storeCode(storeCode)
                .build();

        Store savedStore = storeRepository.save(store);

        // 매장과 사용자 관계 생성 (방금 로그인한 사용자를 매장 관리자로 설정)
        UserStoreRelationship relationship = UserStoreRelationship.builder()
                .user(user)
                .store(savedStore)
                .build();

        userStoreRelationshipRepository.save(relationship);

        // DTO로 변환 후 반환
        return StoreResponseDto.builder()
                .storeCode(savedStore.getStoreCode())
                .name(savedStore.getName())
                .location(savedStore.getLocation())
                .createdAt(savedStore.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<StoreResponseDto> getMyStore(String loginId) {
        // 현재 로그인한 사용자 조회
        User user = userRepository.findByEmail(loginId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 사용자의 매장 목록 조회
        List<UserStoreRelationship> relationships = userStoreRelationshipRepository
                .findByUser_UserId(user.getUserId());

        if (relationships.isEmpty()) {
            throw new RuntimeException("관리 중인 매장이 없습니다.");
        }


        // StoreResponseDto 리스트로 변환
        return relationships.stream()
                .map(relationship -> {
                    Store store = relationship.getStore();
                    return StoreResponseDto.builder()
                            .storeId(store.getId())
                            .storeCode(store.getStoreCode())
                            .name(store.getName())
                            .location(store.getLocation())
                            .createdAt(store.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreResponseDto updateStore(Long storeId, StoreUpdateRequestDto request, String loginId) {
        // 사용자 조회
        User user = userRepository.findByEmail(loginId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 매장 수정 권한 확인 (이 로직은 사용자의 권한에 따라 달라질 수 있음)
        UserStoreRelationship relationship = userStoreRelationshipRepository
                .findByUser_UserIdAndStore_Id(user.getUserId(), storeId)
                .orElseThrow(() -> new RuntimeException("수정 권한이 없습니다."));

        Store store = relationship.getStore();

        // 매장 정보 업데이트
        store.setName(request.getName());
        store.setLocation(request.getLocation());

        Store updatedStore = storeRepository.save(store);

        return StoreResponseDto.builder()
                .storeCode(updatedStore.getStoreCode())
                .name(updatedStore.getName())
                .location(updatedStore.getLocation())
                .createdAt(updatedStore.getCreatedAt())
                .build();
    }

    @Transactional
    public void deleteStore(Long storeId, String loginId) {
        // 사용자 조회
        User user = userRepository.findByEmail(loginId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 매장 삭제 권한 확인 (이 로직은 사용자의 권한에 따라 달라질 수 있음)
        UserStoreRelationship relationship = userStoreRelationshipRepository
                .findByUser_UserIdAndStore_Id(user.getUserId(), storeId)
                .orElseThrow(() -> new RuntimeException("삭제 권한이 없습니다."));

        // 매장 삭제
        storeRepository.deleteById(storeId);
    }

    // 랜덤 매장 코드 생성
    private String generateRandomStoreCode() {
        Random random = new Random();
        char letter1 = (char) ('A' + random.nextInt(26));
        int number1 = random.nextInt(100);
        char letter2 = (char) ('A' + random.nextInt(26));
        char letter3 = (char) ('A' + random.nextInt(26));
        int number2 = random.nextInt(10);

        return String.format("%c%02d%c%c%d", letter1, number1, letter2, letter3, number2);
    }
}
