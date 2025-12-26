package com.vision.paas.deploy.detector;

import com.vision.paas.common.enums.ProjectType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Project Type Detector
 * Automatically detects project type from repository files
 * Supports 20+ project types for zero-configuration deployment
 */
@Slf4j
@Service
public class ProjectDetector {
    
    /**
     * Detect project type by analyzing repository files
     * @param repoPath Path to cloned repository
     * @return Detected ProjectType
     */
    public ProjectType detect(String repoPath) {
        log.info("Detecting project type for: {}", repoPath);
        
        File repoDir = new File(repoPath);
        if (!repoDir.exists() || !repoDir.isDirectory()) {
            log.warn("Invalid repository path: {}", repoPath);
            return ProjectType.UNKNOWN;
        }
        
        // Check for Node.js projects
        if (fileExists(repoPath, "package.json")) {
            return detectNodeProject(repoPath);
        }
        
        // Check for Java projects
        if (fileExists(repoPath, "pom.xml")) {
            return detectJavaProject(repoPath);
        }
        
        if (fileExists(repoPath, "build.gradle") || fileExists(repoPath, "build.gradle.kts")) {
            return ProjectType.SPRING_BOOT;
        }
        
        // Check for Python projects
        if (fileExists(repoPath, "requirements.txt") || fileExists(repoPath, "Pipfile")) {
            return detectPythonProject(repoPath);
        }
        
        // Check for Go projects
        if (fileExists(repoPath, "go.mod")) {
            return detectGoProject(repoPath);
        }
        
        // Check for Ruby projects
        if (fileExists(repoPath, "Gemfile")) {
            return detectRubyProject(repoPath);
        }
        
        // Check for PHP projects
        if (fileExists(repoPath, "composer.json")) {
            return detectPhpProject(repoPath);
        }
        
        // Check for static HTML
        if (fileExists(repoPath, "index.html") && !hasFrameworkFiles(repoPath)) {
            return ProjectType.STATIC_HTML;
        }
        
        log.warn("Could not detect project type for: {}", repoPath);
        return ProjectType.UNKNOWN;
    }
    
    /**
     * Detect Node.js project type
     */
    private ProjectType detectNodeProject(String repoPath) {
        try {
            String packageJson = Files.readString(Paths.get(repoPath, "package.json"));
            
            // Check for Next.js
            if (packageJson.contains("\"next\"") || fileExists(repoPath, "next.config.js")) {
                log.info("Detected Next.js project");
                return ProjectType.NEXTJS;
            }
            
            // Check for NestJS
            if (packageJson.contains("\"@nestjs/core\"")) {
                log.info("Detected NestJS project");
                return ProjectType.NESTJS;
            }
            
            // Check for Nuxt
            if (packageJson.contains("\"nuxt\"")) {
                log.info("Detected Nuxt.js project");
                return ProjectType.NUXT;
            }
            
            // Check for Vue
            if (packageJson.contains("\"vue\"") || fileExists(repoPath, "vue.config.js")) {
                log.info("Detected Vue.js project");
                return ProjectType.VUE;
            }
            
            // Check for Angular
            if (packageJson.contains("\"@angular/core\"")) {
                log.info("Detected Angular project");
                return ProjectType.ANGULAR;
            }
            
            // Check for Svelte
            if (packageJson.contains("\"svelte\"")) {
                log.info("Detected Svelte project");
                return ProjectType.SVELTE;
            }
            
            // Check for Gatsby
            if (packageJson.contains("\"gatsby\"")) {
                log.info("Detected Gatsby project");
                return ProjectType.GATSBY;
            }
            
            // Check for Express
            if (packageJson.contains("\"express\"")) {
                log.info("Detected Express.js project");
                return ProjectType.EXPRESS;
            }
            
            // Check for Koa
            if (packageJson.contains("\"koa\"")) {
                log.info("Detected Koa project");
                return ProjectType.KOA;
            }
            
            // Check for React (fallback)
            if (packageJson.contains("\"react\"")) {
                log.info("Detected React project");
                return ProjectType.REACT;
            }
            
        } catch (IOException e) {
            log.error("Error reading package.json", e);
        }
        
        log.info("Detected generic Node.js project");
        return ProjectType.EXPRESS;
    }
    
    /**
     * Detect Java project type
     */
    private ProjectType detectJavaProject(String repoPath) {
        try {
            String pomXml = Files.readString(Paths.get(repoPath, "pom.xml"));
            
            // Check for Spring Cloud
            if (pomXml.contains("spring-cloud")) {
                log.info("Detected Spring Cloud project");
                return ProjectType.SPRING_CLOUD;
            }
            
            // Check for Micronaut
            if (pomXml.contains("micronaut")) {
                log.info("Detected Micronaut project");
                return ProjectType.MICRONAUT;
            }
            
            // Check for Quarkus
            if (pomXml.contains("quarkus")) {
                log.info("Detected Quarkus project");
                return ProjectType.QUARKUS;
            }
            
            // Default to Spring Boot
            log.info("Detected Spring Boot project");
            return ProjectType.SPRING_BOOT;
            
        } catch (IOException e) {
            log.error("Error reading pom.xml", e);
        }
        
        return ProjectType.SPRING_BOOT;
    }
    
    /**
     * Detect Python project type
     */
    private ProjectType detectPythonProject(String repoPath) {
        try {
            // Check for Django
            if (fileExists(repoPath, "manage.py")) {
                log.info("Detected Django project");
                return ProjectType.DJANGO;
            }
            
            // Check for FastAPI
            if (fileExists(repoPath, "requirements.txt")) {
                String requirements = Files.readString(Paths.get(repoPath, "requirements.txt"));
                if (requirements.contains("fastapi")) {
                    log.info("Detected FastAPI project");
                    return ProjectType.FASTAPI;
                }
                if (requirements.contains("flask")) {
                    log.info("Detected Flask project");
                    return ProjectType.FLASK;
                }
            }
            
        } catch (IOException e) {
            log.error("Error detecting Python project", e);
        }
        
        log.info("Detected Flask project (default)");
        return ProjectType.FLASK;
    }
    
    /**
     * Detect Go project type
     */
    private ProjectType detectGoProject(String repoPath) {
        try {
            String goMod = Files.readString(Paths.get(repoPath, "go.mod"));
            
            if (goMod.contains("github.com/gin-gonic/gin")) {
                log.info("Detected Gin project");
                return ProjectType.GIN;
            }
            
        } catch (IOException e) {
            log.error("Error reading go.mod", e);
        }
        
        log.info("Detected Go project");
        return ProjectType.GO;
    }
    
    /**
     * Detect Ruby project type
     */
    private ProjectType detectRubyProject(String repoPath) {
        if (fileExists(repoPath, "config.ru") || fileExists(repoPath, "config/application.rb")) {
            log.info("Detected Ruby on Rails project");
            return ProjectType.RAILS;
        }
        
        if (fileExists(repoPath, "_config.yml")) {
            log.info("Detected Jekyll project");
            return ProjectType.JEKYLL;
        }
        
        return ProjectType.RAILS;
    }
    
    /**
     * Detect PHP project type
     */
    private ProjectType detectPhpProject(String repoPath) {
        if (fileExists(repoPath, "artisan")) {
            log.info("Detected Laravel project");
            return ProjectType.LARAVEL;
        }
        
        return ProjectType.LARAVEL;
    }
    
    /**
     * Detect port from project configuration
     */
    public int detectPort(String repoPath, ProjectType projectType) {
        // Try to find port in common config files
        try {
            // Node.js - check package.json scripts
            if (fileExists(repoPath, "package.json")) {
                String packageJson = Files.readString(Paths.get(repoPath, "package.json"));
                // Look for PORT=xxxx in start script
                if (packageJson.contains("PORT=")) {
                    // Extract port number
                    int portIndex = packageJson.indexOf("PORT=");
                    String portStr = packageJson.substring(portIndex + 5, Math.min(portIndex + 9, packageJson.length()));
                    try {
                        return Integer.parseInt(portStr.replaceAll("[^0-9]", "").substring(0, 4));
                    } catch (Exception e) {
                        // Continue to default
                    }
                }
            }
            
            // Java - check application.properties
            if (fileExists(repoPath, "src/main/resources/application.properties")) {
                String props = Files.readString(Paths.get(repoPath, "src/main/resources/application.properties"));
                if (props.contains("server.port=")) {
                    int portIndex = props.indexOf("server.port=");
                    String portStr = props.substring(portIndex + 12).split("[^0-9]")[0];
                    try {
                        return Integer.parseInt(portStr);
                    } catch (Exception e) {
                        // Continue to default
                    }
                }
            }
            
        } catch (IOException e) {
            log.error("Error detecting port", e);
        }
        
        // Return default port for project type
        return projectType.getDefaultPort();
    }
    
    /**
     * Check if file exists in repository
     */
    private boolean fileExists(String repoPath, String fileName) {
        return Files.exists(Paths.get(repoPath, fileName));
    }
    
    /**
     * Check if repository has framework files (not just static HTML)
     */
    private boolean hasFrameworkFiles(String repoPath) {
        return fileExists(repoPath, "package.json") ||
               fileExists(repoPath, "pom.xml") ||
               fileExists(repoPath, "requirements.txt") ||
               fileExists(repoPath, "go.mod") ||
               fileExists(repoPath, "Gemfile") ||
               fileExists(repoPath, "composer.json");
    }
}
