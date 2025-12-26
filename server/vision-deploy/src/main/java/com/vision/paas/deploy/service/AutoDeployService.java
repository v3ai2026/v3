package com.vision.paas.deploy.service;

import com.vision.paas.common.enums.DeploymentStatus;
import com.vision.paas.common.enums.ProjectType;
import com.vision.paas.common.exception.BusinessException;
import com.vision.paas.deploy.detector.ProjectDetector;
import com.vision.paas.deploy.docker.DockerService;
import com.vision.paas.deploy.generator.DockerfileGenerator;
import com.vision.paas.deploy.git.GitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Auto Deploy Service
 * Orchestrates the complete deployment process:
 * 1. Clone repository
 * 2. Detect project type
 * 3. Generate Dockerfile
 * 4. Build Docker image
 * 5. Start container
 * 6. Health check
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AutoDeployService {
    
    private final GitService gitService;
    private final ProjectDetector projectDetector;
    private final DockerfileGenerator dockerfileGenerator;
    private final DockerService dockerService;
    
    /**
     * Deploy project automatically (zero-config)
     * @param projectId Project ID
     * @param gitUrl Git repository URL
     * @param envVars Optional environment variables
     * @param memoryMB Memory limit in MB
     * @return Deployment result with container info
     */
    public DeploymentResult deploy(String projectId, String gitUrl, 
                                    Map<String, String> envVars, int memoryMB) {
        log.info("Starting auto-deployment for project: {}", projectId);
        
        DeploymentResult result = new DeploymentResult();
        result.setProjectId(projectId);
        result.setStatus(DeploymentStatus.PENDING);
        
        try {
            // Step 1: Clone repository
            result.setStatus(DeploymentStatus.CLONING);
            log.info("[{}] Cloning repository...", projectId);
            String repoPath = gitService.cloneRepository(gitUrl, projectId);
            result.setRepoPath(repoPath);
            result.addLog("✓ Repository cloned successfully");
            
            // Step 2: Detect project type
            result.setStatus(DeploymentStatus.DETECTING);
            log.info("[{}] Detecting project type...", projectId);
            ProjectType projectType = projectDetector.detect(repoPath);
            result.setProjectType(projectType);
            result.addLog("✓ Detected project type: " + projectType.getDisplayName());
            
            // Step 3: Detect port
            int port = projectDetector.detectPort(repoPath, projectType);
            result.setPort(port);
            result.addLog("✓ Detected port: " + port);
            
            // Step 4: Generate Dockerfile
            log.info("[{}] Generating Dockerfile...", projectId);
            String dockerfile = dockerfileGenerator.generate(projectType, repoPath, port);
            result.setDockerfile(dockerfile);
            result.addLog("✓ Dockerfile generated");
            
            // Step 5: Build Docker image
            result.setStatus(DeploymentStatus.BUILDING);
            log.info("[{}] Building Docker image...", projectId);
            String imageId = dockerService.buildImage(projectId, repoPath, dockerfile);
            result.setImageId(imageId);
            result.addLog("✓ Image built successfully: " + imageId.substring(0, 12));
            
            // Step 6: Start container
            result.setStatus(DeploymentStatus.DEPLOYING);
            log.info("[{}] Starting container...", projectId);
            String containerId = dockerService.startContainer(
                    projectId, imageId, port, envVars, memoryMB);
            result.setContainerId(containerId);
            result.addLog("✓ Container started: " + containerId.substring(0, 12));
            
            // Step 7: Get container port
            Integer hostPort = dockerService.getContainerPort(containerId);
            result.setHostPort(hostPort);
            result.addLog("✓ Container accessible on port: " + hostPort);
            
            // Step 8: Health check
            Thread.sleep(3000); // Wait for container to start
            boolean healthy = dockerService.isContainerHealthy(containerId);
            if (healthy) {
                result.setStatus(DeploymentStatus.RUNNING);
                result.addLog("✓ Deployment successful! Application is running");
                log.info("[{}] Deployment completed successfully", projectId);
            } else {
                result.setStatus(DeploymentStatus.FAILED);
                result.addLog("✗ Health check failed");
                log.error("[{}] Container health check failed", projectId);
            }
            
        } catch (Exception e) {
            log.error("[{}] Deployment failed", projectId, e);
            result.setStatus(DeploymentStatus.FAILED);
            result.addLog("✗ Deployment failed: " + e.getMessage());
            
            // Cleanup on failure
            try {
                if (result.getContainerId() != null) {
                    dockerService.stopContainer(result.getContainerId());
                    dockerService.removeContainer(result.getContainerId());
                }
                gitService.cleanup(projectId);
            } catch (Exception cleanupEx) {
                log.error("Cleanup failed", cleanupEx);
            }
        }
        
        return result;
    }
    
    /**
     * Deploy with custom configuration (advanced mode)
     */
    public DeploymentResult deployWithConfig(String projectId, String gitUrl,
                                              DeploymentConfig config) {
        log.info("Starting custom deployment for project: {}", projectId);
        
        DeploymentResult result = new DeploymentResult();
        result.setProjectId(projectId);
        result.setStatus(DeploymentStatus.PENDING);
        
        try {
            // Clone repository
            result.setStatus(DeploymentStatus.CLONING);
            String repoPath = gitService.cloneRepository(gitUrl, projectId);
            result.setRepoPath(repoPath);
            result.addLog("✓ Repository cloned");
            
            // Use custom Dockerfile if provided
            String dockerfile;
            if (config.getCustomDockerfile() != null) {
                dockerfile = config.getCustomDockerfile();
                result.addLog("✓ Using custom Dockerfile");
            } else {
                // Auto-detect and generate
                result.setStatus(DeploymentStatus.DETECTING);
                ProjectType projectType = config.getProjectType() != null ?
                        config.getProjectType() : projectDetector.detect(repoPath);
                result.setProjectType(projectType);
                
                int port = config.getPort() != null ?
                        config.getPort() : projectDetector.detectPort(repoPath, projectType);
                result.setPort(port);
                
                dockerfile = dockerfileGenerator.generate(projectType, repoPath, port);
                result.addLog("✓ Auto-generated Dockerfile");
            }
            
            result.setDockerfile(dockerfile);
            
            // Build image
            result.setStatus(DeploymentStatus.BUILDING);
            String imageId = dockerService.buildImage(projectId, repoPath, dockerfile);
            result.setImageId(imageId);
            result.addLog("✓ Image built");
            
            // Start container with custom config
            result.setStatus(DeploymentStatus.DEPLOYING);
            String containerId = dockerService.startContainer(
                    projectId, imageId, 
                    config.getPort() != null ? config.getPort() : result.getPort(),
                    config.getEnvVars(), 
                    config.getMemoryMB() != null ? config.getMemoryMB() : 512);
            result.setContainerId(containerId);
            result.addLog("✓ Container started");
            
            // Get container port
            Integer hostPort = dockerService.getContainerPort(containerId);
            result.setHostPort(hostPort);
            
            // Health check
            Thread.sleep(3000);
            boolean healthy = dockerService.isContainerHealthy(containerId);
            result.setStatus(healthy ? DeploymentStatus.RUNNING : DeploymentStatus.FAILED);
            result.addLog(healthy ? "✓ Deployment successful" : "✗ Health check failed");
            
        } catch (Exception e) {
            log.error("[{}] Custom deployment failed", projectId, e);
            result.setStatus(DeploymentStatus.FAILED);
            result.addLog("✗ Deployment failed: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Redeploy existing project
     */
    public DeploymentResult redeploy(String projectId, String gitUrl, 
                                      Map<String, String> envVars, int memoryMB) {
        log.info("Redeploying project: {}", projectId);
        
        // Stop and remove old container
        try {
            String oldContainerId = "vision-" + projectId;
            dockerService.stopContainer(oldContainerId);
            dockerService.removeContainer(oldContainerId);
            dockerService.cleanupImages(projectId);
        } catch (Exception e) {
            log.debug("No existing container to stop", e);
        }
        
        // Deploy fresh
        return deploy(projectId, gitUrl, envVars, memoryMB);
    }
    
    /**
     * Rollback to previous deployment
     */
    public void rollback(String projectId, String previousContainerId) {
        log.info("Rolling back project: {}", projectId);
        
        try {
            // Stop current container
            String currentContainerId = "vision-" + projectId;
            dockerService.stopContainer(currentContainerId);
            dockerService.removeContainer(currentContainerId);
            
            // Start previous container
            dockerService.restartContainer(previousContainerId);
            
            log.info("Rollback completed for project: {}", projectId);
        } catch (Exception e) {
            log.error("Rollback failed", e);
            throw new BusinessException("Rollback failed: " + e.getMessage());
        }
    }
    
    /**
     * Deployment Result DTO
     */
    public static class DeploymentResult {
        private String projectId;
        private DeploymentStatus status;
        private ProjectType projectType;
        private String repoPath;
        private String dockerfile;
        private String imageId;
        private String containerId;
        private Integer port;
        private Integer hostPort;
        private StringBuilder logs = new StringBuilder();
        
        public void addLog(String message) {
            logs.append(message).append("\n");
        }
        
        // Getters and Setters
        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        
        public DeploymentStatus getStatus() { return status; }
        public void setStatus(DeploymentStatus status) { this.status = status; }
        
        public ProjectType getProjectType() { return projectType; }
        public void setProjectType(ProjectType projectType) { this.projectType = projectType; }
        
        public String getRepoPath() { return repoPath; }
        public void setRepoPath(String repoPath) { this.repoPath = repoPath; }
        
        public String getDockerfile() { return dockerfile; }
        public void setDockerfile(String dockerfile) { this.dockerfile = dockerfile; }
        
        public String getImageId() { return imageId; }
        public void setImageId(String imageId) { this.imageId = imageId; }
        
        public String getContainerId() { return containerId; }
        public void setContainerId(String containerId) { this.containerId = containerId; }
        
        public Integer getPort() { return port; }
        public void setPort(Integer port) { this.port = port; }
        
        public Integer getHostPort() { return hostPort; }
        public void setHostPort(Integer hostPort) { this.hostPort = hostPort; }
        
        public String getLogs() { return logs.toString(); }
    }
    
    /**
     * Deployment Configuration DTO (for advanced mode)
     */
    public static class DeploymentConfig {
        private ProjectType projectType;
        private Integer port;
        private String customDockerfile;
        private String buildCommand;
        private String startCommand;
        private Map<String, String> envVars;
        private Integer memoryMB;
        private String rootDirectory;
        
        // Getters and Setters
        public ProjectType getProjectType() { return projectType; }
        public void setProjectType(ProjectType projectType) { this.projectType = projectType; }
        
        public Integer getPort() { return port; }
        public void setPort(Integer port) { this.port = port; }
        
        public String getCustomDockerfile() { return customDockerfile; }
        public void setCustomDockerfile(String customDockerfile) { this.customDockerfile = customDockerfile; }
        
        public String getBuildCommand() { return buildCommand; }
        public void setBuildCommand(String buildCommand) { this.buildCommand = buildCommand; }
        
        public String getStartCommand() { return startCommand; }
        public void setStartCommand(String startCommand) { this.startCommand = startCommand; }
        
        public Map<String, String> getEnvVars() { return envVars; }
        public void setEnvVars(Map<String, String> envVars) { this.envVars = envVars; }
        
        public Integer getMemoryMB() { return memoryMB; }
        public void setMemoryMB(Integer memoryMB) { this.memoryMB = memoryMB; }
        
        public String getRootDirectory() { return rootDirectory; }
        public void setRootDirectory(String rootDirectory) { this.rootDirectory = rootDirectory; }
    }
}
