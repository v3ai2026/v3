package com.vision.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vision.common.exception.BusinessException;
import com.vision.project.entity.ApiKey;
import com.vision.project.mapper.ApiKeyMapper;
import com.vision.project.service.IApiKeyService;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class ApiKeyServiceImpl extends ServiceImpl<ApiKeyMapper, ApiKey> implements IApiKeyService {

    @Override
    public List<ApiKey> getApiKeyList(String userId) {
        QueryWrapper<ApiKey> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.orderByDesc("created_at");
        return this.list(wrapper);
    }

    @Override
    public ApiKey generateApiKey(String userId, String name) {
        // 生成随机 API 密钥
        String key = "vsk_" + UUID.randomUUID().toString().replace("-", "");
        String keyHash = hashKey(key);
        
        ApiKey apiKey = new ApiKey();
        apiKey.setUserId(userId);
        apiKey.setName(name);
        apiKey.setKeyHash(keyHash);
        apiKey.setCreatedAt(LocalDateTime.now());
        
        this.save(apiKey);
        
        // 注意：实际密钥只在生成时返回一次
        apiKey.setKeyHash(key); // 临时设置为明文，仅用于返回
        return apiKey;
    }

    @Override
    public boolean deleteApiKey(String userId, String keyId) {
        ApiKey apiKey = this.getById(keyId);
        if (apiKey == null) {
            throw new BusinessException(404, "API 密钥不存在");
        }
        if (!apiKey.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权删除该密钥");
        }
        
        return this.removeById(keyId);
    }

    @Override
    public ApiKey regenerateApiKey(String userId, String keyId) {
        ApiKey oldKey = this.getById(keyId);
        if (oldKey == null) {
            throw new BusinessException(404, "API 密钥不存在");
        }
        if (!oldKey.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权操作该密钥");
        }
        
        // 删除旧密钥
        this.removeById(keyId);
        
        // 生成新密钥
        return generateApiKey(userId, oldKey.getName());
    }
    
    private String hashKey(String key) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(key.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("密钥哈希失败", e);
        }
    }
}
