package com.vision.user.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户实体（对应 profiles 表）
 */
@Data
@TableName("profiles")
public class User {
    
    @TableId
    private String id;
    
    private String email;
    
    private String fullName;
    
    private String avatarUrl;
    
    private String subscriptionTier;
    
    private String subscriptionStatus;
    
    private String stripeCustomerId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
