package com.vision.paas.visionpayment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.vision.paas.visionpayment", "com.vision.paas.common"})
@EnableDiscoveryClient
public class VisionPaymentApplication {
    public static void main(String[] args) {
        SpringApplication.run(VisionPaymentApplication.class, args);
    }
}
