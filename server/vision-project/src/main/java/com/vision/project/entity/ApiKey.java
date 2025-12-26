package com.vision.project.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * API 密钥实体
 */
@Data
@TableName("api_keys")
public class ApiKey {
    
    @TableId
    private String id;
    
    private String name;
    
    private String keyHash;
    
    private String userId;
    
    private LocalDateTime lastUsedAt;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime expiresAt;
}
