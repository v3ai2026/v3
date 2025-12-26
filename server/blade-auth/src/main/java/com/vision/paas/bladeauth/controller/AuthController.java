package com.vision.paas.bladeauth.controller;

import com.vision.paas.bladeauth.service.AuthService;
import com.vision.paas.common.dto.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ApiResponse<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> result = authService.register(
                request.getEmail(), 
                request.getPassword(), 
                request.getName());
        return ApiResponse.success("Registration successful", result);
    }
    
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> result = authService.login(
                request.getEmail(), 
                request.getPassword());
        return ApiResponse.success("Login successful", result);
    }
    
    @PostMapping("/github")
    public ApiResponse<Map<String, Object>> githubLogin(@RequestBody GitHubLoginRequest request) {
        Map<String, Object> result = authService.githubLogin(
                request.getGithubId(),
                request.getEmail(),
                request.getName(),
                request.getAvatarUrl());
        return ApiResponse.success("GitHub login successful", result);
    }
    
    @PostMapping("/validate")
    public ApiResponse<Boolean> validateToken(@RequestBody TokenRequest request) {
        boolean valid = authService.validateToken(request.getToken());
        return ApiResponse.success(valid);
    }
    
    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.success("Auth service is running");
    }
    
    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
        private String name;
    }
    
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
    
    @Data
    public static class GitHubLoginRequest {
        private String githubId;
        private String email;
        private String name;
        private String avatarUrl;
    }
    
    @Data
    public static class TokenRequest {
        private String token;
    }
}
