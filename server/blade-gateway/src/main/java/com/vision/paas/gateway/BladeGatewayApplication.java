package com.vision.paas.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Blade Gateway Service - Main Application
 * API Gateway with routing, authentication, and rate limiting
 */
@SpringBootApplication(scanBasePackages = {
        "com.vision.paas.gateway",
        "com.vision.paas.common"
})
@EnableDiscoveryClient
public class BladeGatewayApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(BladeGatewayApplication.class, args);
    }
}
