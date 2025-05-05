package com.example.albaease.schedule.service;

import com.example.albaease.schedule.domain.Template;
import com.example.albaease.schedule.dto.TemplateRequest;
import com.example.albaease.schedule.dto.TemplateResponse;
import com.example.albaease.schedule.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// storeId 부분 다 바꿔야함.....
@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;

    // 특정 매장의 템플릿 조회
    @Transactional(readOnly = true)
    public List<TemplateResponse> getTemplatesByStoreId(Long storeId) {
        List<Template> templates = templateRepository.findByStoreId(storeId);
        return templates.stream()
                .map(TemplateResponse::new)
                .collect(Collectors.toList());
    }

    //특정 매장에 템플릿 등록
    @Transactional
    public TemplateResponse createTemplate(Long storeId, TemplateRequest templateRequest) {
        // 요청 데이터 -> Entity 변환
        Template template = new Template();
        template.setStoreId(storeId);
        template.setTemplateName(templateRequest.getTemplateName());
        template.setStartTime(templateRequest.getStartTime());
        template.setEndTime(templateRequest.getEndTime());
        template.setBreakTime(templateRequest.getBreakTime());

        Template savedTemplate = templateRepository.save(template);

        return new TemplateResponse(savedTemplate);
    }

    @Transactional(readOnly = true)
    public Template getTemplateById(Long templateId) {
        return templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + templateId));
    }
}

