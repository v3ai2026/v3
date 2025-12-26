package com.vision.project.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 团队成员实体
 */
@Data
@TableName("team_members")
public class TeamMember {
    
    @TableId
    private String id;
    
    private String teamId;
    
    private String userId;
    
    private String role;  // member, admin, owner
    
    private LocalDateTime joinedAt;
}
