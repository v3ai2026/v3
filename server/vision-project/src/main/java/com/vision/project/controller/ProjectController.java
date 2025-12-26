package com.vision.project.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.vision.common.entity.R;
import com.vision.common.util.JwtUtil;
import com.vision.project.entity.Project;
import com.vision.project.service.IProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private IProjectService projectService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromHeader(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new RuntimeException("未授权");
        }
        String token = authorization.substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }

    @GetMapping
    public R<IPage<Project>> getProjects(@RequestHeader("Authorization") String authorization,
                                          @RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "10") int size) {
        String userId = getUserIdFromHeader(authorization);
        IPage<Project> projects = projectService.getProjectList(userId, page, size);
        return R.success(projects);
    }

    @PostMapping
    public R<Project> createProject(@RequestHeader("Authorization") String authorization,
                                     @RequestBody Project project) {
        String userId = getUserIdFromHeader(authorization);
        Project created = projectService.createProject(userId, project);
        return R.success("项目创建成功", created);
    }

    @GetMapping("/{id}")
    public R<Project> getProject(@RequestHeader("Authorization") String authorization,
                                  @PathVariable String id) {
        String userId = getUserIdFromHeader(authorization);
        Project project = projectService.getProjectDetail(userId, id);
        return R.success(project);
    }

    @PutMapping("/{id}")
    public R<String> updateProject(@RequestHeader("Authorization") String authorization,
                                  @PathVariable String id,
                                  @RequestBody Project project) {
        String userId = getUserIdFromHeader(authorization);
        projectService.updateProject(userId, id, project);
        return R.success("项目更新成功", "项目更新成功");
    }

    @DeleteMapping("/{id}")
    public R<String> deleteProject(@RequestHeader("Authorization") String authorization,
                                  @PathVariable String id) {
        String userId = getUserIdFromHeader(authorization);
        projectService.deleteProject(userId, id);
        return R.success("项目删除成功", "项目删除成功");
    }
}
