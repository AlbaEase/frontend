package com.example.albaease.store.repository;

import com.example.albaease.store.domain.UserStoreRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStoreRelationshipRepository extends JpaRepository<UserStoreRelationship, Long> {
    List<UserStoreRelationship> findByUser_UserId(Long userId);
    Optional<UserStoreRelationship> findByUser_UserIdAndStore_Id(Long userId, Long storeId);
}
