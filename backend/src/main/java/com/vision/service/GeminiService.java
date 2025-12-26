package com.vision.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api-url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> generateContent(String prompt, String model) {
        String url = String.format("%s/%s:generateContent?key=%s", apiUrl, model, apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            log.info("Gemini API response received");
            
            Map<String, Object> result = new HashMap<>();
            result.put("response", response.getBody());
            result.put("success", true);
            return result;
        } catch (HttpClientErrorException e) {
            log.error("Gemini API error: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("success", false);
            return error;
        }
    }

    public Map<String, Object> generateCode(String description) {
        String prompt = String.format(
                "Generate production-ready code based on this description: %s. " +
                "Include all necessary files, imports, and best practices.",
                description
        );
        return generateContent(prompt, "gemini-pro");
    }

    public Map<String, Object> improveCode(String code, String instructions) {
        String prompt = String.format(
                "Improve the following code according to these instructions: %s\n\nCode:\n%s",
                instructions, code
        );
        return generateContent(prompt, "gemini-pro");
    }
}
