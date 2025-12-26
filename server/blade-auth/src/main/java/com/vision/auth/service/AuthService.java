package com.vision.auth.service;

import com.vision.auth.dto.LoginRequest;
import com.vision.auth.dto.RegisterRequest;
import com.vision.auth.dto.TokenResponse;
import com.vision.common.exception.BusinessException;
import com.vision.common.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

/**
 * 认证服务实现
 */
@Service
public class AuthService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 用户登录
     */
    public TokenResponse login(LoginRequest request) {
        String sql = "SELECT id, email, encrypted_password FROM auth.users WHERE email = ?";
        
        try {
            Map<String, Object> user = jdbcTemplate.queryForMap(sql, request.getUsername());
            
            String userId = user.get("id").toString();
            String email = user.get("email").toString();
            String encryptedPassword = user.get("encrypted_password").toString();
            
            // 验证密码
            if (!passwordEncoder.matches(request.getPassword(), encryptedPassword)) {
                throw new BusinessException(401, "用户名或密码错误");
            }
            
            // 生成 Token
            String token = jwtUtil.generateToken(userId, email);
            
            return new TokenResponse(token, "bearer", 604800000L, userId, email);
            
        } catch (Exception e) {
            throw new BusinessException(401, "用户名或密码错误");
        }
    }

    /**
     * 用户注册
     */
    public TokenResponse register(RegisterRequest request) {
        // 检查用户是否已存在
        String checkSql = "SELECT COUNT(*) FROM auth.users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, request.getEmail());
        
        if (count != null && count > 0) {
            throw new BusinessException(400, "该邮箱已被注册");
        }
        
        // 生成用户 ID
        String userId = UUID.randomUUID().toString();
        
        // 加密密码
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        
        // 插入用户（注意：实际应该使用 Supabase Auth API）
        String insertUserSql = "INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at) " +
                "VALUES (?, ?, ?, NOW(), NOW(), NOW())";
        jdbcTemplate.update(insertUserSql, userId, request.getEmail(), encryptedPassword);
        
        // 创建用户资料
        String insertProfileSql = "INSERT INTO profiles (id, email, full_name, subscription_tier, created_at, updated_at) " +
                "VALUES (?, ?, ?, 'free', NOW(), NOW())";
        jdbcTemplate.update(insertProfileSql, userId, request.getEmail(), request.getFullName());
        
        // 生成 Token
        String token = jwtUtil.generateToken(userId, request.getEmail());
        
        return new TokenResponse(token, "bearer", 604800000L, userId, request.getEmail());
    }

    /**
     * 刷新 Token
     */
    public TokenResponse refreshToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new BusinessException(401, "Token 无效");
        }
        
        String userId = jwtUtil.getUserIdFromToken(token);
        String username = jwtUtil.getUsernameFromToken(token);
        
        String newToken = jwtUtil.generateToken(userId, username);
        
        return new TokenResponse(newToken, "bearer", 604800000L, userId, username);
    }
}
