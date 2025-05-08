package com.example.albaease.store.domain;

import com.example.albaease.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_store_relationship",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "store_id"}))
public class UserStoreRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_store_relationship_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "work_start_date")
    private LocalDateTime workStartDate; // 근무 시작 일자
}
