package com.vision.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vision.project.entity.Team;
import com.vision.project.entity.TeamMember;

import java.util.List;

/**
 * 团队服务接口
 */
public interface ITeamService extends IService<Team> {
    
    /**
     * 获取团队列表
     */
    List<Team> getTeamList(String userId);
    
    /**
     * 创建团队
     */
    Team createTeam(String userId, Team team);
    
    /**
     * 获取团队详情
     */
    Team getTeamDetail(String userId, String teamId);
    
    /**
     * 添加团队成员
     */
    boolean addTeamMember(String userId, String teamId, String memberId, String role);
    
    /**
     * 移除团队成员
     */
    boolean removeTeamMember(String userId, String teamId, String memberId);
    
    /**
     * 修改成员角色
     */
    boolean updateMemberRole(String userId, String teamId, String memberId, String role);
    
    /**
     * 获取团队成员列表
     */
    List<TeamMember> getTeamMembers(String teamId);
}
