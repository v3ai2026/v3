package com.vision.paas.common.util;

import java.security.SecureRandom;
import java.util.UUID;

/**
 * ID Generator Utility
 */
public class IdGenerator {
    
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    
    public static String generateId() {
        return UUID.randomUUID().toString().replace("-", "");
    }
    
    public static String generateShortId(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
    
    public static String generateApiKey() {
        return "vp_" + generateId();
    }
    
    public static String generateProjectSlug(String projectName) {
        return projectName.toLowerCase()
                .replaceAll("[^a-z0-9-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "")
                + "-" + generateShortId(6);
    }
}
