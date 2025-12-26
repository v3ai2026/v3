package com.vision;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "jwt.secret=test-secret-key-for-jwt-token-generation-must-be-at-least-256-bits",
    "stripe.api-key=sk_test_dummy",
    "stripe.webhook-secret=whsec_dummy",
    "stripe.pro-price-id=price_dummy",
    "stripe.enterprise-price-id=price_dummy",
    "gemini.api-key=dummy-api-key"
})
class VisionBackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
