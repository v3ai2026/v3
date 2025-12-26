package com.vision.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vision.common.exception.BusinessException;
import com.vision.project.entity.Project;
import com.vision.project.mapper.ProjectMapper;
import com.vision.project.service.IProjectService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 项目服务实现
 */
@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements IProjectService {

    @Override
    public IPage<Project> getProjectList(String userId, int page, int size) {
        Page<Project> pageParam = new Page<>(page, size);
        QueryWrapper<Project> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.orderByDesc("created_at");
        return this.page(pageParam, wrapper);
    }

    @Override
    public Project createProject(String userId, Project project) {
        project.setUserId(userId);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        this.save(project);
        return project;
    }

    @Override
    public Project getProjectDetail(String userId, String projectId) {
        Project project = this.getById(projectId);
        if (project == null) {
            throw new BusinessException(404, "项目不存在");
        }
        if (!project.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权访问该项目");
        }
        return project;
    }

    @Override
    public boolean updateProject(String userId, String projectId, Project project) {
        Project existingProject = this.getById(projectId);
        if (existingProject == null) {
            throw new BusinessException(404, "项目不存在");
        }
        if (!existingProject.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权修改该项目");
        }
        
        project.setId(projectId);
        project.setUserId(userId);
        project.setUpdatedAt(LocalDateTime.now());
        return this.updateById(project);
    }

    @Override
    public boolean deleteProject(String userId, String projectId) {
        Project project = this.getById(projectId);
        if (project == null) {
            throw new BusinessException(404, "项目不存在");
        }
        if (!project.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权删除该项目");
        }
        
        return this.removeById(projectId);
    }
}
