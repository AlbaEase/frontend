package com.example.albaease.store.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreUpdateRequestDto {
    private String name;
    private String location;
    private String contactNumber;
}
