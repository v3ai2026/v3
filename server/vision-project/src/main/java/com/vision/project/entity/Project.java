package com.vision.project.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 项目实体
 */
@Data
@TableName("projects")
public class Project {
    
    @TableId
    private String id;
    
    private String name;
    
    private String description;
    
    private String settings;  // JSONB 存储为字符串
    
    private String userId;
    
    private String teamId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
