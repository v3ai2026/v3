package com.vision.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * User 服务启动类
 */
@SpringBootApplication(scanBasePackages = {"com.vision.user", "com.vision.common"})
@EnableDiscoveryClient
@MapperScan("com.vision.user.mapper")
public class UserApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
        System.out.println("=================================");
        System.out.println("Vision User 启动成功！端口：8101");
        System.out.println("=================================");
    }
}
