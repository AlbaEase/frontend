package com.example.albaease.notification.repository;

import com.example.albaease.notification.domain.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 특정 사용자의 모든 알림 목록 조회 (최신순)
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Long userId);


    // 사용자의 모든 알림 삭제
    void deleteByUser_UserId(Long userId);

}

