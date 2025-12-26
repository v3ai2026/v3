package com.vision.paas.visionproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.vision.paas.visionproject", "com.vision.paas.common"})
@EnableDiscoveryClient
public class VisionProjectApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisionProjectApplication.class, args);
    }
}
