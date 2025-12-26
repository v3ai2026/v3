package com.vision.paas.common.enums;

/**
 * Subscription Plans
 */
public enum SubscriptionPlan {
    FREE("Free", 0, 1, 100, 512),
    HOBBY("Hobby", 29, 5, 1000, 1024),
    PRO("Pro", 99, 20, 10000, 2048),
    ENTERPRISE("Enterprise", 299, -1, -1, 4096);
    
    private final String displayName;
    private final int monthlyPrice;
    private final int maxProjects;
    private final int maxDeployments;
    private final int maxMemoryMB;
    
    SubscriptionPlan(String displayName, int monthlyPrice, int maxProjects, 
                     int maxDeployments, int maxMemoryMB) {
        this.displayName = displayName;
        this.monthlyPrice = monthlyPrice;
        this.maxProjects = maxProjects;
        this.maxDeployments = maxDeployments;
        this.maxMemoryMB = maxMemoryMB;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public int getMonthlyPrice() {
        return monthlyPrice;
    }
    
    public int getMaxProjects() {
        return maxProjects;
    }
    
    public int getMaxDeployments() {
        return maxDeployments;
    }
    
    public int getMaxMemoryMB() {
        return maxMemoryMB;
    }
}
