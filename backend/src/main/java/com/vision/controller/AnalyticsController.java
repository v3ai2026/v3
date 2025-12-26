package com.vision.controller;

import com.vision.dto.ApiResponse;
import com.vision.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ProjectRepository projectRepository;
    private final AuthHelper authHelper;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(Authentication authentication) {
        UUID userId = authHelper.getUserIdFromAuth(authentication);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", projectRepository.countByUserId(userId));
        stats.put("completedProjects", projectRepository.countByUserIdAndStatus(userId, "completed"));
        stats.put("draftProjects", projectRepository.countByUserIdAndStatus(userId, "draft"));

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/trends")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTrends(Authentication authentication) {
        UUID userId = authHelper.getUserIdFromAuth(authentication);

        Map<String, Object> trends = new HashMap<>();
        // This would include more complex analytics like monthly trends, usage patterns, etc.
        trends.put("message", "Trends data - to be implemented with time-series queries");

        return ResponseEntity.ok(ApiResponse.success(trends));
    }
}
