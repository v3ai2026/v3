package com.vision.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vision.user.entity.User;

/**
 * User 服务接口
 */
public interface IUserService extends IService<User> {
    
    /**
     * 获取当前用户信息
     */
    User getCurrentUserInfo(String userId);
    
    /**
     * 更新用户信息
     */
    boolean updateUserInfo(String userId, User user);
    
    /**
     * 删除用户账号
     */
    boolean deleteAccount(String userId);
}
