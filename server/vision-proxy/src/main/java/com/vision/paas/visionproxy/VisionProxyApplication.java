package com.vision.paas.visionproxy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.vision.paas.visionproxy", "com.vision.paas.common"})
@EnableDiscoveryClient
public class VisionProxyApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisionProxyApplication.class, args);
    }
}
