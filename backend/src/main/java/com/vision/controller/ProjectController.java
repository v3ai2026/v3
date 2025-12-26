package com.vision.controller;

import com.vision.dto.ApiResponse;
import com.vision.dto.ProjectDto;
import com.vision.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuthHelper authHelper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getUserProjects(Authentication authentication) {
        UUID userId = authHelper.getUserIdFromAuth(authentication);
        List<ProjectDto> projects = projectService.getUserProjects(userId);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProject(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID userId = authHelper.getUserIdFromAuth(authentication);
        ProjectDto project = projectService.getProjectById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(
            @RequestBody ProjectDto dto,
            Authentication authentication) {
        UUID userId = authHelper.getUserIdFromAuth(authentication);
        ProjectDto project = projectService.createProject(dto, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable UUID id,
            @RequestBody ProjectDto dto,
            Authentication authentication) {
        UUID userId = authHelper.getUserIdFromAuth(authentication);
        ProjectDto project = projectService.updateProject(id, dto, userId);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID userId = authHelper.getUserIdFromAuth(authentication);
        projectService.deleteProject(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
