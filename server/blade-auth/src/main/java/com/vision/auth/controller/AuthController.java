package com.vision.auth.controller;

import com.vision.auth.dto.LoginRequest;
import com.vision.auth.dto.RegisterRequest;
import com.vision.auth.dto.TokenResponse;
import com.vision.auth.service.AuthService;
import com.vision.common.entity.R;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/oauth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 登录接口
     * POST /blade-auth/oauth/token
     */
    @PostMapping("/token")
    public R<TokenResponse> login(@RequestParam(required = false) String username,
                                   @RequestParam(required = false) String password,
                                   @RequestParam(required = false) String grant_type,
                                   @RequestParam(required = false) String scope,
                                   @RequestBody(required = false) LoginRequest loginRequest) {
        // 兼容表单和 JSON 两种方式
        LoginRequest request = new LoginRequest();
        if (loginRequest != null) {
            request = loginRequest;
        } else {
            request.setUsername(username);
            request.setPassword(password);
            request.setGrantType(grant_type);
            request.setScope(scope);
        }
        
        TokenResponse response = authService.login(request);
        return R.success(response);
    }

    /**
     * 注册接口
     * POST /blade-auth/register
     */
    @PostMapping("/register")
    public R<TokenResponse> register(@RequestBody RegisterRequest request) {
        TokenResponse response = authService.register(request);
        return R.success("注册成功", response);
    }

    /**
     * 刷新 Token
     * POST /blade-auth/oauth/refresh
     */
    @PostMapping("/refresh")
    public R<TokenResponse> refresh(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "").replace("bearer ", "");
        TokenResponse response = authService.refreshToken(token);
        return R.success(response);
    }

    /**
     * 登出接口
     * POST /blade-auth/oauth/logout
     */
    @PostMapping("/logout")
    public R<Void> logout() {
        // Token 是无状态的，登出由前端处理（删除 token）
        return R.success("登出成功");
    }
}
