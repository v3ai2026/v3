package com.vision.payment.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("subscriptions")
public class Subscription {
    
    @TableId
    private String id;
    
    private String userId;
    
    private String stripeSubscriptionId;
    
    private String stripeCustomerId;
    
    private String tier;
    
    private String status;
    
    private LocalDateTime currentPeriodStart;
    
    private LocalDateTime currentPeriodEnd;
    
    private LocalDateTime cancelAt;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
