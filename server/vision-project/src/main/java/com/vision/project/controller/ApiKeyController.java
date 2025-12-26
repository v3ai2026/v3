package com.vision.project.controller;

import com.vision.common.entity.R;
import com.vision.common.util.JwtUtil;
import com.vision.project.entity.ApiKey;
import com.vision.project.service.IApiKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api-keys")
public class ApiKeyController {

    @Autowired
    private IApiKeyService apiKeyService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromHeader(String authorization) {
        String token = authorization.replace("Bearer ", "");
        return jwtUtil.getUserIdFromToken(token);
    }

    @GetMapping
    public R<List<ApiKey>> getApiKeys(@RequestHeader("Authorization") String authorization) {
        String userId = getUserIdFromHeader(authorization);
        List<ApiKey> apiKeys = apiKeyService.getApiKeyList(userId);
        return R.success(apiKeys);
    }

    @PostMapping
    public R<ApiKey> generateApiKey(@RequestHeader("Authorization") String authorization,
                                     @RequestBody Map<String, String> request) {
        String userId = getUserIdFromHeader(authorization);
        String name = request.get("name");
        ApiKey apiKey = apiKeyService.generateApiKey(userId, name);
        return R.success("API 密钥生成成功", apiKey);
    }

    @DeleteMapping("/{id}")
    public R<String> deleteApiKey(@RequestHeader("Authorization") String authorization,
                                 @PathVariable String id) {
        String userId = getUserIdFromHeader(authorization);
        apiKeyService.deleteApiKey(userId, id);
        return R.success("API 密钥删除成功", "API 密钥删除成功");
    }

    @PutMapping("/{id}/regenerate")
    public R<ApiKey> regenerateApiKey(@RequestHeader("Authorization") String authorization,
                                       @PathVariable String id) {
        String userId = getUserIdFromHeader(authorization);
        ApiKey apiKey = apiKeyService.regenerateApiKey(userId, id);
        return R.success("API 密钥重新生成成功", apiKey);
    }
}
