package com.vision.paas.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Authentication Filter
 * Validates JWT tokens and API keys
 */
@Slf4j
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {
    
    private static final List<String> EXCLUDED_PATHS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/health",
            "/actuator"
    );
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        
        log.debug("Processing request: {} {}", request.getMethod(), path);
        
        // Skip authentication for excluded paths
        if (isExcludedPath(path)) {
            return chain.filter(exchange);
        }
        
        // Check for API Key
        String apiKey = request.getHeaders().getFirst("X-API-Key");
        if (apiKey != null && validateApiKey(apiKey)) {
            log.debug("Valid API key authentication");
            return chain.filter(exchange);
        }
        
        // Check for JWT Token
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (validateJwtToken(token)) {
                log.debug("Valid JWT authentication");
                return chain.filter(exchange);
            }
        }
        
        // No valid authentication found
        log.warn("Unauthorized request to: {}", path);
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
    
    private boolean isExcludedPath(String path) {
        return EXCLUDED_PATHS.stream().anyMatch(path::startsWith);
    }
    
    private boolean validateApiKey(String apiKey) {
        // TODO: Implement API key validation with vision-user service
        return apiKey.startsWith("vp_");
    }
    
    private boolean validateJwtToken(String token) {
        // TODO: Implement JWT validation with blade-auth service
        return token != null && !token.isEmpty();
    }
    
    @Override
    public int getOrder() {
        return -100;
    }
}
