package com.vision.payment.service;

public interface IStripeService {
    
    /**
     * 创建支付会话
     */
    String createCheckoutSession(String priceId, String userId);
    
    /**
     * 创建客户门户会话
     */
    String createPortalSession(String customerId);
    
    /**
     * 处理 Webhook 事件
     */
    void handleWebhook(String payload, String sigHeader);
    
    /**
     * 获取订阅状态
     */
    Object getSubscriptionStatus(String userId);
    
    /**
     * 取消订阅
     */
    boolean cancelSubscription(String userId);
}
