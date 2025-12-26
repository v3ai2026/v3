package com.vision.project.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 团队实体
 */
@Data
@TableName("teams")
public class Team {
    
    @TableId
    private String id;
    
    private String name;
    
    private String ownerId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
