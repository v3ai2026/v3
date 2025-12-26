package com.vision.service;

import com.vision.dto.UserDto;
import com.vision.exception.ResourceNotFoundException;
import com.vision.model.User;
import com.vision.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserDto getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDto(user);
    }

    @Transactional
    public UserDto updateUserProfile(UUID userId, UserDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getUsername() != null && !dto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new IllegalArgumentException("Username already taken");
            }
            user.setUsername(dto.getUsername());
        }

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getCompany() != null) user.setCompany(dto.getCompany());
        if (dto.getWebsite() != null) user.setWebsite(dto.getWebsite());
        if (dto.getLocation() != null) user.setLocation(dto.getLocation());

        User updatedUser = userRepository.save(user);
        log.info("User profile updated: {}", userId);

        return convertToDto(updatedUser);
    }

    @Transactional
    public void updatePassword(UUID userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password updated for user: {}", userId);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setCompany(user.getCompany());
        dto.setWebsite(user.getWebsite());
        dto.setLocation(user.getLocation());
        dto.setSubscriptionTier(user.getSubscriptionTier());
        dto.setSubscriptionStatus(user.getSubscriptionStatus());
        dto.setSubscriptionEndDate(user.getSubscriptionEndDate());
        dto.setAiCredits(user.getAiCredits());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
