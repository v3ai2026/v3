package com.vision.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Auth 服务启动类
 */
@SpringBootApplication(scanBasePackages = {"com.vision.auth", "com.vision.common"})
@EnableDiscoveryClient
public class AuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
        System.out.println("=================================");
        System.out.println("Blade Auth 启动成功！端口：8100");
        System.out.println("=================================");
    }
}
