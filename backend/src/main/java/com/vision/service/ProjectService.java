package com.vision.service;

import com.vision.dto.ProjectDto;
import com.vision.exception.ResourceNotFoundException;
import com.vision.exception.UnauthorizedException;
import com.vision.model.Project;
import com.vision.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<ProjectDto> getUserProjects(UUID userId) {
        return projectRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getUserId().equals(userId) && !project.getIsPublic()) {
            throw new UnauthorizedException("You don't have permission to access this project");
        }

        return convertToDto(project);
    }

    @Transactional
    public ProjectDto createProject(ProjectDto dto, UUID userId) {
        Project project = new Project();
        project.setUserId(userId);
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setProjectType(dto.getProjectType());
        project.setFramework(dto.getFramework());
        project.setStatus("draft");
        project.setIsPublic(dto.getIsPublic() != null ? dto.getIsPublic() : false);
        project.setIsTemplate(dto.getIsTemplate() != null ? dto.getIsTemplate() : false);
        project.setTags(dto.getTags());
        project.setMetadata(dto.getMetadata());

        Project savedProject = projectRepository.save(project);
        log.info("Project created: {} by user: {}", savedProject.getId(), userId);

        return convertToDto(savedProject);
    }

    @Transactional
    public ProjectDto updateProject(UUID projectId, ProjectDto dto, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to update this project");
        }

        if (dto.getName() != null) project.setName(dto.getName());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getProjectType() != null) project.setProjectType(dto.getProjectType());
        if (dto.getFramework() != null) project.setFramework(dto.getFramework());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        if (dto.getThumbnailUrl() != null) project.setThumbnailUrl(dto.getThumbnailUrl());
        if (dto.getPreviewUrl() != null) project.setPreviewUrl(dto.getPreviewUrl());
        if (dto.getRepositoryUrl() != null) project.setRepositoryUrl(dto.getRepositoryUrl());
        if (dto.getGiteeRepoUrl() != null) project.setGiteeRepoUrl(dto.getGiteeRepoUrl());
        if (dto.getVercelDeploymentUrl() != null) project.setVercelDeploymentUrl(dto.getVercelDeploymentUrl());
        if (dto.getIsPublic() != null) project.setIsPublic(dto.getIsPublic());
        if (dto.getIsTemplate() != null) project.setIsTemplate(dto.getIsTemplate());
        if (dto.getTags() != null) project.setTags(dto.getTags());
        if (dto.getMetadata() != null) project.setMetadata(dto.getMetadata());

        Project updatedProject = projectRepository.save(project);
        log.info("Project updated: {}", projectId);

        return convertToDto(updatedProject);
    }

    @Transactional
    public void deleteProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to delete this project");
        }

        projectRepository.delete(project);
        log.info("Project deleted: {}", projectId);
    }

    private ProjectDto convertToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setUserId(project.getUserId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setProjectType(project.getProjectType());
        dto.setFramework(project.getFramework());
        dto.setStatus(project.getStatus());
        dto.setThumbnailUrl(project.getThumbnailUrl());
        dto.setPreviewUrl(project.getPreviewUrl());
        dto.setRepositoryUrl(project.getRepositoryUrl());
        dto.setGiteeRepoUrl(project.getGiteeRepoUrl());
        dto.setVercelDeploymentUrl(project.getVercelDeploymentUrl());
        dto.setIsPublic(project.getIsPublic());
        dto.setIsTemplate(project.getIsTemplate());
        dto.setTags(project.getTags());
        dto.setMetadata(project.getMetadata());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        dto.setLastDeployedAt(project.getLastDeployedAt());
        return dto;
    }
}
