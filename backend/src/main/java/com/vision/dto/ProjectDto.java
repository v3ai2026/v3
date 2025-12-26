package com.vision.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private UUID id;
    private UUID userId;
    private String name;
    private String description;
    private String projectType;
    private String framework;
    private String status;
    private String thumbnailUrl;
    private String previewUrl;
    private String repositoryUrl;
    private String giteeRepoUrl;
    private String vercelDeploymentUrl;
    private Boolean isPublic;
    private Boolean isTemplate;
    private List<String> tags;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastDeployedAt;
}
