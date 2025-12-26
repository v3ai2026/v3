package com.vision.paas.deploy.docker;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.BuildImageResultCallback;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import com.vision.paas.common.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileWriter;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Docker Service
 * Manages Docker containers and images
 */
@Slf4j
@Service
public class DockerService {
    
    private DockerClient dockerClient;
    
    @PostConstruct
    public void init() {
        try {
            DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                    .build();
            
            DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                    .dockerHost(config.getDockerHost())
                    .sslConfig(config.getSSLConfig())
                    .maxConnections(100)
                    .connectionTimeout(Duration.ofSeconds(30))
                    .responseTimeout(Duration.ofSeconds(45))
                    .build();
            
            dockerClient = DockerClientImpl.getInstance(config, httpClient);
            log.info("Docker client initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize Docker client", e);
        }
    }
    
    /**
     * Build Docker image from Dockerfile
     * @param projectId Project ID
     * @param repoPath Path to repository
     * @param dockerfileContent Dockerfile content
     * @return Image ID
     */
    public String buildImage(String projectId, String repoPath, String dockerfileContent) {
        log.info("Building Docker image for project: {}", projectId);
        
        try {
            // Write Dockerfile
            File dockerfilePath = new File(repoPath + "/Dockerfile");
            try (FileWriter writer = new FileWriter(dockerfilePath)) {
                writer.write(dockerfileContent);
            }
            
            String imageName = "vision-paas/" + projectId.toLowerCase();
            String imageTag = "latest";
            
            // Build image
            String imageId = dockerClient.buildImageCmd()
                    .withDockerfile(dockerfilePath)
                    .withBaseDirectory(new File(repoPath))
                    .withTags(Collections.singleton(imageName + ":" + imageTag))
                    .exec(new BuildImageResultCallback())
                    .awaitImageId(10, TimeUnit.MINUTES);
            
            log.info("Successfully built image: {} with ID: {}", imageName, imageId);
            return imageId;
            
        } catch (Exception e) {
            log.error("Failed to build Docker image", e);
            throw new BusinessException("Failed to build image: " + e.getMessage());
        }
    }
    
    /**
     * Create and start container
     * @param projectId Project ID
     * @param imageId Image ID
     * @param port Application port
     * @param envVars Environment variables
     * @param memoryMB Memory limit in MB
     * @return Container ID
     */
    public String startContainer(String projectId, String imageId, int port, 
                                  Map<String, String> envVars, int memoryMB) {
        log.info("Starting container for project: {}", projectId);
        
        try {
            String containerName = "vision-" + projectId;
            
            // Stop and remove existing container if exists
            try {
                stopContainer(containerName);
                removeContainer(containerName);
            } catch (Exception e) {
                // Container doesn't exist, continue
            }
            
            // Prepare environment variables
            List<String> env = new ArrayList<>();
            if (envVars != null) {
                envVars.forEach((key, value) -> env.add(key + "=" + value));
            }
            
            // Create container
            CreateContainerResponse container = dockerClient.createContainerCmd(imageId)
                    .withName(containerName)
                    .withEnv(env)
                    .withExposedPorts(ExposedPort.tcp(port))
                    .withHostConfig(HostConfig.newHostConfig()
                            .withPortBindings(new PortBinding(
                                    Ports.Binding.bindPort(0), // Random host port
                                    ExposedPort.tcp(port)
                            ))
                            .withMemory((long) memoryMB * 1024 * 1024)
                            .withMemorySwap((long) memoryMB * 1024 * 1024)
                            .withRestartPolicy(RestartPolicy.onFailureRestart(3))
                    )
                    .exec();
            
            String containerId = container.getId();
            
            // Start container
            dockerClient.startContainerCmd(containerId).exec();
            
            log.info("Container started successfully: {}", containerId);
            return containerId;
            
        } catch (Exception e) {
            log.error("Failed to start container", e);
            throw new BusinessException("Failed to start container: " + e.getMessage());
        }
    }
    
    /**
     * Stop container
     */
    public void stopContainer(String containerId) {
        try {
            dockerClient.stopContainerCmd(containerId)
                    .withTimeout(30)
                    .exec();
            log.info("Container stopped: {}", containerId);
        } catch (Exception e) {
            log.error("Failed to stop container", e);
            throw new BusinessException("Failed to stop container: " + e.getMessage());
        }
    }
    
    /**
     * Remove container
     */
    public void removeContainer(String containerId) {
        try {
            dockerClient.removeContainerCmd(containerId)
                    .withForce(true)
                    .exec();
            log.info("Container removed: {}", containerId);
        } catch (Exception e) {
            log.error("Failed to remove container", e);
        }
    }
    
    /**
     * Get container logs
     */
    public String getContainerLogs(String containerId, int tail) {
        try {
            return dockerClient.logContainerCmd(containerId)
                    .withStdOut(true)
                    .withStdErr(true)
                    .withTail(tail)
                    .exec(new LogContainerResultCallback())
                    .awaitCompletion()
                    .toString();
        } catch (Exception e) {
            log.error("Failed to get container logs", e);
            return "Failed to retrieve logs";
        }
    }
    
    /**
     * Check container health
     */
    public boolean isContainerHealthy(String containerId) {
        try {
            var inspect = dockerClient.inspectContainerCmd(containerId).exec();
            String status = inspect.getState().getStatus();
            return "running".equalsIgnoreCase(status);
        } catch (Exception e) {
            log.error("Failed to check container health", e);
            return false;
        }
    }
    
    /**
     * Get container stats (CPU, Memory)
     */
    public Map<String, Object> getContainerStats(String containerId) {
        Map<String, Object> stats = new HashMap<>();
        try {
            var inspect = dockerClient.inspectContainerCmd(containerId).exec();
            stats.put("status", inspect.getState().getStatus());
            stats.put("startedAt", inspect.getState().getStartedAt());
            stats.put("running", inspect.getState().getRunning());
        } catch (Exception e) {
            log.error("Failed to get container stats", e);
        }
        return stats;
    }
    
    /**
     * Restart container
     */
    public void restartContainer(String containerId) {
        try {
            dockerClient.restartContainerCmd(containerId)
                    .withTimeout(30)
                    .exec();
            log.info("Container restarted: {}", containerId);
        } catch (Exception e) {
            log.error("Failed to restart container", e);
            throw new BusinessException("Failed to restart container: " + e.getMessage());
        }
    }
    
    /**
     * Get container port mapping
     */
    public Integer getContainerPort(String containerId) {
        try {
            var inspect = dockerClient.inspectContainerCmd(containerId).exec();
            var ports = inspect.getNetworkSettings().getPorts();
            for (var entry : ports.getBindings().entrySet()) {
                var bindings = entry.getValue();
                if (bindings != null && bindings.length > 0) {
                    return Integer.parseInt(bindings[0].getHostPortSpec());
                }
            }
        } catch (Exception e) {
            log.error("Failed to get container port", e);
        }
        return null;
    }
    
    /**
     * Clean up old images
     */
    public void cleanupImages(String projectId) {
        try {
            String imageName = "vision-paas/" + projectId.toLowerCase();
            dockerClient.removeImageCmd(imageName + ":latest")
                    .withForce(true)
                    .exec();
            log.info("Cleaned up image: {}", imageName);
        } catch (Exception e) {
            log.debug("No image to cleanup or cleanup failed", e);
        }
    }
}
