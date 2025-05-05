package com.example.albaease.store.domain;

import com.example.albaease.schedule.domain.Schedule;
import com.example.albaease.store.domain.UserStoreRelationship;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "store")
public class Store implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "store_code", unique = true)  // storeCode 추가
    private String storeCode;  // 랜덤 매장 코드 필드 추가

    @Column(name = "require_approval")
    private Boolean require_approval;

    @Column(name = "business_number", unique = true)
    private String businessNumber; // 사업자 등록 번호

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // User_Store_Relationship 매핑
    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserStoreRelationship> userStoreRelationships;

    // Schedule 매핑
    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.require_approval = false; // 기본값은 미검증
    }

}
