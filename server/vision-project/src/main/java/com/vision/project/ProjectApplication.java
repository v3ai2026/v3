package com.vision.project;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Project 服务启动类
 */
@SpringBootApplication(scanBasePackages = {"com.vision.project", "com.vision.common"})
@EnableDiscoveryClient
@MapperScan("com.vision.project.mapper")
public class ProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectApplication.class, args);
        System.out.println("=================================");
        System.out.println("Vision Project 启动成功！端口：8102");
        System.out.println("=================================");
    }
}
