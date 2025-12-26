package com.vision.paas.bladeauth.repository;

import com.vision.paas.bladeauth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGithubId(String githubId);
    boolean existsByEmail(String email);
}
