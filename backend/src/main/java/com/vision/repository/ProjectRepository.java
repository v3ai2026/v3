package com.vision.repository;

import com.vision.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByUserId(UUID userId);
    List<Project> findByUserIdAndStatus(UUID userId, String status);
    List<Project> findByIsPublicTrue();
    long countByUserId(UUID userId);
    long countByUserIdAndStatus(UUID userId, String status);
}
