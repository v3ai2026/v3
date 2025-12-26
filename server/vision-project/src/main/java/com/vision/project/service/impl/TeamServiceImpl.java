package com.vision.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vision.common.exception.BusinessException;
import com.vision.project.entity.Team;
import com.vision.project.entity.TeamMember;
import com.vision.project.mapper.TeamMapper;
import com.vision.project.mapper.TeamMemberMapper;
import com.vision.project.service.ITeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TeamServiceImpl extends ServiceImpl<TeamMapper, Team> implements ITeamService {

    @Autowired
    private TeamMemberMapper teamMemberMapper;

    @Override
    public List<Team> getTeamList(String userId) {
        QueryWrapper<Team> ownerWrapper = new QueryWrapper<>();
        ownerWrapper.eq("owner_id", userId);
        return this.list(ownerWrapper);
    }

    @Override
    public Team createTeam(String userId, Team team) {
        team.setOwnerId(userId);
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        this.save(team);
        
        TeamMember ownerMember = new TeamMember();
        ownerMember.setTeamId(team.getId());
        ownerMember.setUserId(userId);
        ownerMember.setRole("owner");
        ownerMember.setJoinedAt(LocalDateTime.now());
        teamMemberMapper.insert(ownerMember);
        
        return team;
    }

    @Override
    public Team getTeamDetail(String userId, String teamId) {
        Team team = this.getById(teamId);
        if (team == null) {
            throw new BusinessException(404, "团队不存在");
        }
        if (!isTeamMember(userId, teamId)) {
            throw new BusinessException(403, "无权访问该团队");
        }
        return team;
    }

    @Override
    public boolean addTeamMember(String userId, String teamId, String memberId, String role) {
        Team team = this.getById(teamId);
        if (team == null || !team.getOwnerId().equals(userId)) {
            throw new BusinessException(403, "只有团队所有者可以添加成员");
        }
        
        TeamMember teamMember = new TeamMember();
        teamMember.setTeamId(teamId);
        teamMember.setUserId(memberId);
        teamMember.setRole(role);
        teamMember.setJoinedAt(LocalDateTime.now());
        
        return teamMemberMapper.insert(teamMember) > 0;
    }

    @Override
    public boolean removeTeamMember(String userId, String teamId, String memberId) {
        Team team = this.getById(teamId);
        if (team == null || !team.getOwnerId().equals(userId)) {
            throw new BusinessException(403, "只有团队所有者可以移除成员");
        }
        
        QueryWrapper<TeamMember> wrapper = new QueryWrapper<>();
        wrapper.eq("team_id", teamId).eq("user_id", memberId);
        return teamMemberMapper.delete(wrapper) > 0;
    }

    @Override
    public boolean updateMemberRole(String userId, String teamId, String memberId, String role) {
        Team team = this.getById(teamId);
        if (team == null || !team.getOwnerId().equals(userId)) {
            throw new BusinessException(403, "只有团队所有者可以修改成员角色");
        }
        
        QueryWrapper<TeamMember> wrapper = new QueryWrapper<>();
        wrapper.eq("team_id", teamId).eq("user_id", memberId);
        TeamMember member = teamMemberMapper.selectOne(wrapper);
        
        if (member == null) {
            throw new BusinessException(404, "成员不存在");
        }
        
        member.setRole(role);
        return teamMemberMapper.updateById(member) > 0;
    }

    @Override
    public List<TeamMember> getTeamMembers(String teamId) {
        QueryWrapper<TeamMember> wrapper = new QueryWrapper<>();
        wrapper.eq("team_id", teamId);
        return teamMemberMapper.selectList(wrapper);
    }
    
    private boolean isTeamMember(String userId, String teamId) {
        Team team = this.getById(teamId);
        if (team != null && team.getOwnerId().equals(userId)) {
            return true;
        }
        QueryWrapper<TeamMember> wrapper = new QueryWrapper<>();
        wrapper.eq("team_id", teamId).eq("user_id", userId);
        return teamMemberMapper.selectCount(wrapper) > 0;
    }
}
