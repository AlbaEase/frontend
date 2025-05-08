package com.example.albaease.schedule.controller;

import com.example.albaease.schedule.dto.TemplateRequest;
import com.example.albaease.schedule.dto.TemplateResponse;
import com.example.albaease.schedule.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/template")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    // 특정 매장의 템플릿 조회 API
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<TemplateResponse>> getTemplates(@PathVariable Long storeId) {
        List<TemplateResponse> templates = templateService.getTemplatesByStoreId(storeId);
        return ResponseEntity.ok(templates);
    }

    // 특정 매장에 템플릿 등록
    @PostMapping("/store/{storeId}")
    public ResponseEntity<TemplateResponse> createTemplate(
            @PathVariable Long storeId,
            @RequestBody TemplateRequest templateRequest) {

        TemplateResponse createdTemplate = templateService.createTemplate(storeId, templateRequest);
        return ResponseEntity.ok(createdTemplate);
    }
}

