package com.vision.paas.deploy.git;

import com.vision.paas.common.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Git Service
 * Handles repository cloning and Git operations
 */
@Slf4j
@Service
public class GitService {
    
    private static final String CLONE_BASE_PATH = "/tmp/vision-deploy";
    
    /**
     * Clone a Git repository
     * @param gitUrl Repository URL
     * @param projectId Project ID for directory naming
     * @return Path to cloned repository
     */
    public String cloneRepository(String gitUrl, String projectId) {
        log.info("Cloning repository: {} for project: {}", gitUrl, projectId);
        
        try {
            // Create base directory if not exists
            Path basePath = Paths.get(CLONE_BASE_PATH);
            if (!Files.exists(basePath)) {
                Files.createDirectories(basePath);
            }
            
            // Create project-specific directory
            String targetPath = CLONE_BASE_PATH + "/" + projectId;
            File targetDir = new File(targetPath);
            
            // Clean up existing directory
            if (targetDir.exists()) {
                deleteDirectory(targetDir);
            }
            
            // Clone repository
            Git git = Git.cloneRepository()
                    .setURI(gitUrl)
                    .setDirectory(targetDir)
                    .setBranch("main")
                    .call();
            
            git.close();
            
            log.info("Successfully cloned repository to: {}", targetPath);
            return targetPath;
            
        } catch (GitAPIException e) {
            log.error("Failed to clone repository", e);
            
            // Try with master branch if main fails
            try {
                String targetPath = CLONE_BASE_PATH + "/" + projectId;
                File targetDir = new File(targetPath);
                
                if (targetDir.exists()) {
                    deleteDirectory(targetDir);
                }
                
                Git git = Git.cloneRepository()
                        .setURI(gitUrl)
                        .setDirectory(targetDir)
                        .setBranch("master")
                        .call();
                
                git.close();
                
                log.info("Successfully cloned repository (master branch) to: {}", targetPath);
                return targetPath;
                
            } catch (Exception ex) {
                throw new BusinessException("Failed to clone repository: " + ex.getMessage());
            }
            
        } catch (Exception e) {
            log.error("Unexpected error while cloning", e);
            throw new BusinessException("Failed to clone repository: " + e.getMessage());
        }
    }
    
    /**
     * Pull latest changes from repository
     */
    public void pullLatest(String repoPath) {
        try {
            Git git = Git.open(new File(repoPath));
            git.pull().call();
            git.close();
            log.info("Successfully pulled latest changes for: {}", repoPath);
        } catch (Exception e) {
            log.error("Failed to pull latest changes", e);
            throw new BusinessException("Failed to pull repository: " + e.getMessage());
        }
    }
    
    /**
     * Get current commit SHA
     */
    public String getCurrentCommit(String repoPath) {
        try {
            Git git = Git.open(new File(repoPath));
            String sha = git.getRepository().resolve("HEAD").getName();
            git.close();
            return sha;
        } catch (Exception e) {
            log.error("Failed to get current commit", e);
            return "unknown";
        }
    }
    
    /**
     * Clean up cloned repository
     */
    public void cleanup(String projectId) {
        try {
            String targetPath = CLONE_BASE_PATH + "/" + projectId;
            File targetDir = new File(targetPath);
            if (targetDir.exists()) {
                deleteDirectory(targetDir);
                log.info("Cleaned up repository for project: {}", projectId);
            }
        } catch (Exception e) {
            log.error("Failed to cleanup repository", e);
        }
    }
    
    /**
     * Recursively delete directory
     */
    private void deleteDirectory(File directory) {
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteDirectory(file);
                } else {
                    file.delete();
                }
            }
        }
        directory.delete();
    }
}
