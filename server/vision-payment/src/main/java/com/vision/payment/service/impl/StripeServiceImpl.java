package com.vision.payment.service.impl;

import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.vision.common.exception.BusinessException;
import com.vision.payment.service.IStripeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@Service
public class StripeServiceImpl implements IStripeService {

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public String createCheckoutSession(String priceId, String userId) {
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build()
                )
                .setSuccessUrl(frontendUrl + "/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/cancel")
                .setClientReferenceId(userId)
                .build();

            Session session = Session.create(params);
            return session.getUrl();
        } catch (StripeException e) {
            throw new BusinessException("创建支付会话失败: " + e.getMessage());
        }
    }

    @Override
    public String createPortalSession(String customerId) {
        try {
            com.stripe.param.billingportal.SessionCreateParams params = 
                com.stripe.param.billingportal.SessionCreateParams.builder()
                .setCustomer(customerId)
                .setReturnUrl(frontendUrl + "/billing")
                .build();

            com.stripe.model.billingportal.Session session = 
                com.stripe.model.billingportal.Session.create(params);
            return session.getUrl();
        } catch (StripeException e) {
            throw new BusinessException("创建客户门户会话失败: " + e.getMessage());
        }
    }

    @Override
    public void handleWebhook(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            switch (event.getType()) {
                case "checkout.session.completed":
                    handleCheckoutCompleted(event);
                    break;
                case "customer.subscription.created":
                case "customer.subscription.updated":
                    handleSubscriptionUpdated(event);
                    break;
                case "customer.subscription.deleted":
                    handleSubscriptionDeleted(event);
                    break;
            }
        } catch (Exception e) {
            throw new BusinessException("Webhook 处理失败: " + e.getMessage());
        }
    }

    @Override
    public Object getSubscriptionStatus(String userId) {
        String sql = "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
        try {
            Map<String, Object> subscription = jdbcTemplate.queryForMap(sql, userId);
            return subscription;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean cancelSubscription(String userId) {
        String sql = "UPDATE profiles SET subscription_status = 'canceled' WHERE id = ?";
        return jdbcTemplate.update(sql, userId) > 0;
    }

    private void handleCheckoutCompleted(Event event) {
        // 处理支付完成事件
        // 更新用户订阅状态
    }

    private void handleSubscriptionUpdated(Event event) {
        // 处理订阅更新事件
        // 更新数据库中的订阅信息
    }

    private void handleSubscriptionDeleted(Event event) {
        // 处理订阅删除事件
        // 更新用户订阅状态为已取消
    }
}
