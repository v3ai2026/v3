package com.vision.paas.visiondatabase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.vision.paas.visiondatabase", "com.vision.paas.common"})
@EnableDiscoveryClient
public class VisionDatabaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisionDatabaseApplication.class, args);
    }
}
