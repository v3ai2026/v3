package com.vision.paas.deploy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Vision Deploy Service - Main Application
 * Core deployment service with auto-detection and Docker integration
 */
@SpringBootApplication(scanBasePackages = {
        "com.vision.paas.deploy",
        "com.vision.paas.common"
})
@EnableDiscoveryClient
public class VisionDeployApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(VisionDeployApplication.class, args);
    }
}
