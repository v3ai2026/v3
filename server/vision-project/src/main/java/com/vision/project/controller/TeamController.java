package com.vision.project.controller;

import com.vision.common.entity.R;
import com.vision.common.util.JwtUtil;
import com.vision.project.entity.Team;
import com.vision.project.entity.TeamMember;
import com.vision.project.service.ITeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teams")
public class TeamController {

    @Autowired
    private ITeamService teamService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromHeader(String authorization) {
        String token = authorization.replace("Bearer ", "");
        return jwtUtil.getUserIdFromToken(token);
    }

    @GetMapping
    public R<List<Team>> getTeams(@RequestHeader("Authorization") String authorization) {
        String userId = getUserIdFromHeader(authorization);
        List<Team> teams = teamService.getTeamList(userId);
        return R.success(teams);
    }

    @PostMapping
    public R<Team> createTeam(@RequestHeader("Authorization") String authorization,
                               @RequestBody Team team) {
        String userId = getUserIdFromHeader(authorization);
        Team created = teamService.createTeam(userId, team);
        return R.success("团队创建成功", created);
    }

    @GetMapping("/{id}")
    public R<Team> getTeam(@RequestHeader("Authorization") String authorization,
                            @PathVariable String id) {
        String userId = getUserIdFromHeader(authorization);
        Team team = teamService.getTeamDetail(userId, id);
        return R.success(team);
    }

    @PostMapping("/{id}/members")
    public R<String> addMember(@RequestHeader("Authorization") String authorization,
                              @PathVariable String id,
                              @RequestBody Map<String, String> request) {
        String userId = getUserIdFromHeader(authorization);
        String memberId = request.get("userId");
        String role = request.getOrDefault("role", "member");
        teamService.addTeamMember(userId, id, memberId, role);
        return R.success("成员添加成功", "成员添加成功");
    }

    @DeleteMapping("/{id}/members/{userId}")
    public R<String> removeMember(@RequestHeader("Authorization") String authorization,
                                 @PathVariable String id,
                                 @PathVariable String userId) {
        String currentUserId = getUserIdFromHeader(authorization);
        teamService.removeTeamMember(currentUserId, id, userId);
        return R.success("成员移除成功", "成员移除成功");
    }

    @PutMapping("/{id}/members/{userId}/role")
    public R<String> updateMemberRole(@RequestHeader("Authorization") String authorization,
                                      @PathVariable String id,
                                      @PathVariable String userId,
                                      @RequestBody Map<String, String> request) {
        String currentUserId = getUserIdFromHeader(authorization);
        String role = request.get("role");
        teamService.updateMemberRole(currentUserId, id, userId, role);
        return R.success("角色更新成功", "角色更新成功");
    }

    @GetMapping("/{id}/members")
    public R<List<TeamMember>> getMembers(@PathVariable String id) {
        List<TeamMember> members = teamService.getTeamMembers(id);
        return R.success(members);
    }
}
