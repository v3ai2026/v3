package com.vision.paas.visionuser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.vision.paas.visionuser", "com.vision.paas.common"})
@EnableDiscoveryClient
public class VisionUserApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisionUserApplication.class, args);
    }
}
