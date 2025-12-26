package com.vision.auth.dto;

import lombok.Data;

/**
 * 注册请求 DTO
 */
@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
}
