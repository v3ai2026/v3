package com.vision.paas.common.enums;

/**
 * Project Types - Auto-detected by vision-deploy service
 * Supports 20+ project types for zero-config deployment
 */
public enum ProjectType {
    // Frontend Frameworks
    NEXTJS("Next.js", "node", 3000),
    REACT("React", "node", 3000),
    VUE("Vue.js", "node", 8080),
    ANGULAR("Angular", "node", 4200),
    SVELTE("Svelte", "node", 5000),
    NUXT("Nuxt.js", "node", 3000),
    
    // Backend Frameworks - Java
    SPRING_BOOT("Spring Boot", "java", 8080),
    SPRING_CLOUD("Spring Cloud", "java", 8080),
    MICRONAUT("Micronaut", "java", 8080),
    QUARKUS("Quarkus", "java", 8080),
    
    // Backend Frameworks - Python
    DJANGO("Django", "python", 8000),
    FLASK("Flask", "python", 5000),
    FASTAPI("FastAPI", "python", 8000),
    
    // Backend Frameworks - Node.js
    EXPRESS("Express.js", "node", 3000),
    NESTJS("NestJS", "node", 3000),
    KOA("Koa", "node", 3000),
    
    // Backend Frameworks - Go
    GO("Go", "go", 8080),
    GIN("Gin", "go", 8080),
    
    // Backend Frameworks - Other
    RAILS("Ruby on Rails", "ruby", 3000),
    LARAVEL("Laravel", "php", 8000),
    
    // Static Sites
    STATIC_HTML("Static HTML", "static", 80),
    GATSBY("Gatsby", "node", 8000),
    HUGO("Hugo", "go", 1313),
    JEKYLL("Jekyll", "ruby", 4000),
    
    // Unknown/Custom
    UNKNOWN("Unknown", "unknown", 8080);
    
    private final String displayName;
    private final String runtime;
    private final int defaultPort;
    
    ProjectType(String displayName, String runtime, int defaultPort) {
        this.displayName = displayName;
        this.runtime = runtime;
        this.defaultPort = defaultPort;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getRuntime() {
        return runtime;
    }
    
    public int getDefaultPort() {
        return defaultPort;
    }
}
