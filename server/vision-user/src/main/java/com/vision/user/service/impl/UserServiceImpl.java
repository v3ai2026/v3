package com.vision.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vision.common.exception.BusinessException;
import com.vision.user.entity.User;
import com.vision.user.mapper.UserMapper;
import com.vision.user.service.IUserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * User 服务实现
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Override
    public User getCurrentUserInfo(String userId) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        return user;
    }

    @Override
    public boolean updateUserInfo(String userId, User user) {
        User existingUser = this.getById(userId);
        if (existingUser == null) {
            throw new BusinessException(404, "用户不存在");
        }
        
        user.setId(userId);
        user.setUpdatedAt(LocalDateTime.now());
        return this.updateById(user);
    }

    @Override
    public boolean deleteAccount(String userId) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        
        return this.removeById(userId);
    }
}
