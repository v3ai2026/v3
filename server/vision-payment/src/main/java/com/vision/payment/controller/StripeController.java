package com.vision.payment.controller;

import com.vision.common.entity.R;
import com.vision.common.util.JwtUtil;
import com.vision.payment.service.IStripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
public class StripeController {

    @Autowired
    private IStripeService stripeService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromHeader(String authorization) {
        String token = authorization.replace("Bearer ", "");
        return jwtUtil.getUserIdFromToken(token);
    }

    /**
     * 创建支付会话
     * POST /api/payment/checkout
     */
    @PostMapping("/checkout")
    public R<Map<String, String>> createCheckout(@RequestHeader("Authorization") String authorization,
                                                   @RequestBody Map<String, String> request) {
        String userId = getUserIdFromHeader(authorization);
        String priceId = request.get("priceId");
        
        String sessionUrl = stripeService.createCheckoutSession(priceId, userId);
        
        return R.success(Map.of("sessionUrl", sessionUrl));
    }

    /**
     * 创建客户门户会话
     * POST /api/payment/portal
     */
    @PostMapping("/portal")
    public R<Map<String, String>> createPortal(@RequestHeader("Authorization") String authorization,
                                                 @RequestBody Map<String, String> request) {
        String customerId = request.get("customerId");
        
        String portalUrl = stripeService.createPortalSession(customerId);
        
        return R.success(Map.of("portalUrl", portalUrl));
    }

    /**
     * Stripe Webhook
     * POST /api/payment/webhook
     */
    @PostMapping("/webhook")
    public R<Void> handleWebhook(@RequestBody String payload,
                                   @RequestHeader("Stripe-Signature") String sigHeader) {
        stripeService.handleWebhook(payload, sigHeader);
        return R.success();
    }

    /**
     * 获取订阅状态
     * GET /api/payment/subscription
     */
    @GetMapping("/subscription")
    public R<Object> getSubscription(@RequestHeader("Authorization") String authorization) {
        String userId = getUserIdFromHeader(authorization);
        Object subscription = stripeService.getSubscriptionStatus(userId);
        return R.success(subscription);
    }

    /**
     * 取消订阅
     * DELETE /api/payment/subscription
     */
    @DeleteMapping("/subscription")
    public R<String> cancelSubscription(@RequestHeader("Authorization") String authorization) {
        String userId = getUserIdFromHeader(authorization);
        stripeService.cancelSubscription(userId);
        return R.success("订阅已取消", "订阅已取消");
    }
}
