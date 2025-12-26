package com.vision.project.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.vision.project.entity.Project;

/**
 * 项目服务接口
 */
public interface IProjectService extends IService<Project> {
    
    /**
     * 分页查询项目列表
     */
    IPage<Project> getProjectList(String userId, int page, int size);
    
    /**
     * 创建项目
     */
    Project createProject(String userId, Project project);
    
    /**
     * 获取项目详情
     */
    Project getProjectDetail(String userId, String projectId);
    
    /**
     * 更新项目
     */
    boolean updateProject(String userId, String projectId, Project project);
    
    /**
     * 删除项目
     */
    boolean deleteProject(String userId, String projectId);
}
