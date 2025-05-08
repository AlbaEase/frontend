package com.example.albaease.store.repository;

import com.example.albaease.store.domain.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    // 사업자등록번호로 매장 존재 여부 확인
    boolean existsByBusinessNumber(String businessNumber);

    // 사업자등록번호로 매장 조회
    Store findByBusinessNumber(String businessNumber);
}
