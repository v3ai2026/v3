package com.vision.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String username;
    private String fullName;
    private String avatarUrl;
    private String email;
    private String bio;
    private String company;
    private String website;
    private String location;
    private String subscriptionTier;
    private String subscriptionStatus;
    private LocalDateTime subscriptionEndDate;
    private Integer aiCredits;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
