package com.vision.paas.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate Limiting Filter
 * Implements token bucket algorithm for rate limiting
 */
@Slf4j
@Component
public class RateLimitFilter implements GlobalFilter, Ordered {
    
    private final ConcurrentHashMap<String, RateLimitBucket> buckets = new ConcurrentHashMap<>();
    
    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String clientId = getClientId(exchange);
        
        RateLimitBucket bucket = buckets.computeIfAbsent(clientId, 
                k -> new RateLimitBucket(MAX_REQUESTS_PER_MINUTE));
        
        if (bucket.tryConsume()) {
            log.debug("Request allowed for client: {}", clientId);
            return chain.filter(exchange);
        } else {
            log.warn("Rate limit exceeded for client: {}", clientId);
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }
    }
    
    private String getClientId(ServerWebExchange exchange) {
        // Use API key if available, otherwise use IP address
        String apiKey = exchange.getRequest().getHeaders().getFirst("X-API-Key");
        if (apiKey != null) {
            return apiKey;
        }
        
        String clientIp = exchange.getRequest().getRemoteAddress() != null ?
                exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() : "unknown";
        return clientIp;
    }
    
    @Override
    public int getOrder() {
        return -50;
    }
    
    /**
     * Simple token bucket implementation
     */
    private static class RateLimitBucket {
        private final int capacity;
        private final AtomicInteger tokens;
        private long lastRefillTime;
        
        public RateLimitBucket(int capacity) {
            this.capacity = capacity;
            this.tokens = new AtomicInteger(capacity);
            this.lastRefillTime = System.currentTimeMillis();
        }
        
        public synchronized boolean tryConsume() {
            refill();
            if (tokens.get() > 0) {
                tokens.decrementAndGet();
                return true;
            }
            return false;
        }
        
        private void refill() {
            long now = System.currentTimeMillis();
            long timePassed = now - lastRefillTime;
            
            // Refill 1 token per second
            int tokensToAdd = (int) (timePassed / 1000);
            if (tokensToAdd > 0) {
                int newTokens = Math.min(capacity, tokens.get() + tokensToAdd);
                tokens.set(newTokens);
                lastRefillTime = now;
            }
        }
    }
}
