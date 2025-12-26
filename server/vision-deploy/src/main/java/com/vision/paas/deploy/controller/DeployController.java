package com.vision.paas.deploy.controller;

import com.vision.paas.common.dto.ApiResponse;
import com.vision.paas.deploy.service.AutoDeployService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Deployment Controller
 * REST API for deployment operations
 */
@Slf4j
@RestController
@RequestMapping("/api/deploy")
@RequiredArgsConstructor
public class DeployController {
    
    private final AutoDeployService autoDeployService;
    
    /**
     * Auto-deploy (zero-config mode)
     * POST /api/deploy/auto
     */
    @PostMapping("/auto")
    public ApiResponse<AutoDeployService.DeploymentResult> autoDeploy(
            @RequestBody AutoDeployRequest request) {
        log.info("Received auto-deploy request for project: {}", request.getProjectId());
        
        AutoDeployService.DeploymentResult result = autoDeployService.deploy(
                request.getProjectId(),
                request.getGitUrl(),
                request.getEnvVars(),
                request.getMemoryMB() != null ? request.getMemoryMB() : 512
        );
        
        return ApiResponse.success("Deployment initiated", result);
    }
    
    /**
     * Deploy with custom config (advanced mode)
     * POST /api/deploy/custom
     */
    @PostMapping("/custom")
    public ApiResponse<AutoDeployService.DeploymentResult> customDeploy(
            @RequestBody CustomDeployRequest request) {
        log.info("Received custom deploy request for project: {}", request.getProjectId());
        
        AutoDeployService.DeploymentConfig config = new AutoDeployService.DeploymentConfig();
        config.setProjectType(request.getProjectType());
        config.setPort(request.getPort());
        config.setCustomDockerfile(request.getCustomDockerfile());
        config.setBuildCommand(request.getBuildCommand());
        config.setStartCommand(request.getStartCommand());
        config.setEnvVars(request.getEnvVars());
        config.setMemoryMB(request.getMemoryMB());
        config.setRootDirectory(request.getRootDirectory());
        
        AutoDeployService.DeploymentResult result = autoDeployService.deployWithConfig(
                request.getProjectId(),
                request.getGitUrl(),
                config
        );
        
        return ApiResponse.success("Custom deployment initiated", result);
    }
    
    /**
     * Redeploy project
     * POST /api/deploy/redeploy/{projectId}
     */
    @PostMapping("/redeploy/{projectId}")
    public ApiResponse<AutoDeployService.DeploymentResult> redeploy(
            @PathVariable String projectId,
            @RequestBody RedeployRequest request) {
        log.info("Received redeploy request for project: {}", projectId);
        
        AutoDeployService.DeploymentResult result = autoDeployService.redeploy(
                projectId,
                request.getGitUrl(),
                request.getEnvVars(),
                request.getMemoryMB() != null ? request.getMemoryMB() : 512
        );
        
        return ApiResponse.success("Redeployment completed", result);
    }
    
    /**
     * Health check
     * GET /api/deploy/health
     */
    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.success("Deploy service is running");
    }
    
    // Request DTOs
    public static class AutoDeployRequest {
        private String projectId;
        private String gitUrl;
        private Map<String, String> envVars;
        private Integer memoryMB;
        
        // Getters and Setters
        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        
        public String getGitUrl() { return gitUrl; }
        public void setGitUrl(String gitUrl) { this.gitUrl = gitUrl; }
        
        public Map<String, String> getEnvVars() { return envVars; }
        public void setEnvVars(Map<String, String> envVars) { this.envVars = envVars; }
        
        public Integer getMemoryMB() { return memoryMB; }
        public void setMemoryMB(Integer memoryMB) { this.memoryMB = memoryMB; }
    }
    
    public static class CustomDeployRequest extends AutoDeployRequest {
        private com.vision.paas.common.enums.ProjectType projectType;
        private Integer port;
        private String customDockerfile;
        private String buildCommand;
        private String startCommand;
        private String rootDirectory;
        
        // Getters and Setters
        public com.vision.paas.common.enums.ProjectType getProjectType() { return projectType; }
        public void setProjectType(com.vision.paas.common.enums.ProjectType projectType) { 
            this.projectType = projectType; 
        }
        
        public Integer getPort() { return port; }
        public void setPort(Integer port) { this.port = port; }
        
        public String getCustomDockerfile() { return customDockerfile; }
        public void setCustomDockerfile(String customDockerfile) { 
            this.customDockerfile = customDockerfile; 
        }
        
        public String getBuildCommand() { return buildCommand; }
        public void setBuildCommand(String buildCommand) { this.buildCommand = buildCommand; }
        
        public String getStartCommand() { return startCommand; }
        public void setStartCommand(String startCommand) { this.startCommand = startCommand; }
        
        public String getRootDirectory() { return rootDirectory; }
        public void setRootDirectory(String rootDirectory) { this.rootDirectory = rootDirectory; }
    }
    
    public static class RedeployRequest {
        private String gitUrl;
        private Map<String, String> envVars;
        private Integer memoryMB;
        
        // Getters and Setters
        public String getGitUrl() { return gitUrl; }
        public void setGitUrl(String gitUrl) { this.gitUrl = gitUrl; }
        
        public Map<String, String> getEnvVars() { return envVars; }
        public void setEnvVars(Map<String, String> envVars) { this.envVars = envVars; }
        
        public Integer getMemoryMB() { return memoryMB; }
        public void setMemoryMB(Integer memoryMB) { this.memoryMB = memoryMB; }
    }
}
