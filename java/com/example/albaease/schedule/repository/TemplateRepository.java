package com.example.albaease.schedule.repository;

import com.example.albaease.schedule.domain.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {

    // 특정 스토어 템플릿 조회
    List<Template> findByStoreId(Long storeId);

    // 템플릿 이름으로 조회
    List<Template> findByTemplateName(String templateName);
}
