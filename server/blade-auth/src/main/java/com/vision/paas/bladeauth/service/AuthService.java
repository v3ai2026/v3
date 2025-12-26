package com.vision.paas.bladeauth.service;

import com.vision.paas.bladeauth.entity.User;
import com.vision.paas.bladeauth.repository.UserRepository;
import com.vision.paas.common.exception.BusinessException;
import com.vision.paas.common.util.IdGenerator;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Service
 * Handles user registration, login, and JWT token management
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Value("${jwt.secret:vision-paas-secret-key-change-in-production-please}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400000}") // 24 hours
    private long jwtExpiration;
    
    /**
     * Register new user
     */
    public Map<String, Object> register(String email, String password, String name) {
        log.info("Registering new user: {}", email);
        
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(400, "Email already registered");
        }
        
        User user = new User();
        user.setId(IdGenerator.generateId());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setName(name);
        
        userRepository.save(user);
        
        String token = generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        
        log.info("User registered successfully: {}", email);
        return response;
    }
    
    /**
     * Login user
     */
    public Map<String, Object> login(String email, String password) {
        log.info("User login attempt: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(401, "Invalid credentials"));
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException(401, "Invalid credentials");
        }
        
        String token = generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        
        log.info("User logged in successfully: {}", email);
        return response;
    }
    
    /**
     * GitHub OAuth login
     */
    public Map<String, Object> githubLogin(String githubId, String email, String name, String avatarUrl) {
        log.info("GitHub OAuth login: {}", email);
        
        User user = userRepository.findByGithubId(githubId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setId(IdGenerator.generateId());
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setGithubId(githubId);
                    newUser.setAvatarUrl(avatarUrl);
                    newUser.setPasswordHash(passwordEncoder.encode(IdGenerator.generateId()));
                    return userRepository.save(newUser);
                });
        
        String token = generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        
        return response;
    }
    
    /**
     * Generate JWT token
     */
    private String generateToken(User user) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.builder()
                .setSubject(user.getId())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    
    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Get user ID from token
     */
    public String getUserIdFromToken(String token) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
