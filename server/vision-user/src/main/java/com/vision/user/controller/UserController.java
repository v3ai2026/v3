package com.vision.user.controller;

import com.vision.common.entity.R;
import com.vision.common.util.JwtUtil;
import com.vision.user.entity.User;
import com.vision.user.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 从请求头获取用户 ID
     */
    private String getUserIdFromHeader(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new RuntimeException("未授权");
        }
        String token = authorization.substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }

    /**
     * 获取当前用户信息
     * GET /api/user/info
     */
    @GetMapping("/info")
    public R<User> getUserInfo(@RequestHeader("Authorization") String authorization) {
        String userId = getUserIdFromHeader(authorization);
        User user = userService.getCurrentUserInfo(userId);
        return R.success(user);
    }

    /**
     * 更新用户信息
     * PUT /api/user/info
     */
    @PutMapping("/info")
    public R<String> updateUserInfo(@RequestHeader("Authorization") String authorization,
                                   @RequestBody User user) {
        String userId = getUserIdFromHeader(authorization);
        userService.updateUserInfo(userId, user);
        return R.success("更新成功", "更新成功");
    }

    /**
     * 删除账号
     * DELETE /api/user/account
     */
    @DeleteMapping("/account")
    public R<String> deleteAccount(@RequestHeader("Authorization") String authorization) {
        String userId = getUserIdFromHeader(authorization);
        userService.deleteAccount(userId);
        return R.success("账号已删除", "账号已删除");
    }
}
