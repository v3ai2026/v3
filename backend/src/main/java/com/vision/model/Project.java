package com.vision.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "project_type", length = 50)
    private String projectType;

    @Column(length = 50)
    private String framework;

    @Column(length = 20)
    private String status = "draft";

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "preview_url")
    private String previewUrl;

    @Column(name = "repository_url")
    private String repositoryUrl;

    @Column(name = "gitee_repo_url")
    private String giteeRepoUrl;

    @Column(name = "vercel_deployment_url")
    private String vercelDeploymentUrl;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @Column(name = "is_template")
    private Boolean isTemplate = false;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> tags;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_deployed_at")
    private LocalDateTime lastDeployedAt;
}
