package com.vision.paas.visionmonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.vision.paas.visionmonitor", "com.vision.paas.common"})
@EnableDiscoveryClient
public class VisionMonitorApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisionMonitorApplication.class, args);
    }
}
