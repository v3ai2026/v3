package com.vision.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vision.project.entity.ApiKey;

import java.util.List;

/**
 * API 密钥服务接口
 */
public interface IApiKeyService extends IService<ApiKey> {
    
    /**
     * 获取 API 密钥列表
     */
    List<ApiKey> getApiKeyList(String userId);
    
    /**
     * 生成新密钥
     */
    ApiKey generateApiKey(String userId, String name);
    
    /**
     * 删除密钥
     */
    boolean deleteApiKey(String userId, String keyId);
    
    /**
     * 重新生成密钥
     */
    ApiKey regenerateApiKey(String userId, String keyId);
}
