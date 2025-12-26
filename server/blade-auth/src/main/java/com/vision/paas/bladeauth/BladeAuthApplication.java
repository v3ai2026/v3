package com.vision.paas.bladeauth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {
        "com.vision.paas.bladeauth",
        "com.vision.paas.common"
})
@EnableDiscoveryClient
public class BladeAuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(BladeAuthApplication.class, args);
    }
}
