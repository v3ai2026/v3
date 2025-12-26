package com.vision.paas.common.enums;

/**
 * Deployment Status
 */
public enum DeploymentStatus {
    PENDING("Pending"),
    CLONING("Cloning Repository"),
    DETECTING("Detecting Project Type"),
    BUILDING("Building Image"),
    DEPLOYING("Deploying Container"),
    RUNNING("Running"),
    FAILED("Failed"),
    STOPPED("Stopped"),
    ROLLING_BACK("Rolling Back");
    
    private final String displayName;
    
    DeploymentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
