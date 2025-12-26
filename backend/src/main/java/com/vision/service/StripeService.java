package com.vision.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.vision.model.Payment;
import com.vision.model.Subscription;
import com.vision.model.User;
import com.vision.repository.SubscriptionRepository;
import com.vision.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripeService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @Value("${stripe.pro-price-id}")
    private String proPriceId;

    @Value("${stripe.enterprise-price-id}")
    private String enterprisePriceId;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Transactional
    public Map<String, String> createCheckoutSession(UUID userId, String planName, String successUrl, String cancelUrl) throws StripeException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String priceId = "pro".equals(planName) ? proPriceId : enterprisePriceId;

        // Create or get Stripe customer
        String customerId = user.getStripeCustomerId();
        if (customerId == null) {
            Customer customer = Customer.create(
                    Map.of(
                            "email", user.getEmail(),
                            "name", user.getFullName()
                    )
            );
            customerId = customer.getId();
            user.setStripeCustomerId(customerId);
            userRepository.save(user);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setCustomer(customerId)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build()
                )
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putMetadata("userId", userId.toString())
                .putMetadata("planName", planName)
                .build();

        Session session = Session.create(params);
        log.info("Checkout session created for user: {}", userId);

        Map<String, String> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("url", session.getUrl());

        return response;
    }

    @Transactional
    public void handleWebhook(String payload, String sigHeader, String webhookSecret) throws StripeException {
        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

        switch (event.getType()) {
            case "customer.subscription.created":
            case "customer.subscription.updated":
                handleSubscriptionUpdated(event);
                break;
            case "customer.subscription.deleted":
                handleSubscriptionDeleted(event);
                break;
            case "invoice.payment_succeeded":
                handlePaymentSucceeded(event);
                break;
            default:
                log.info("Unhandled event type: {}", event.getType());
        }
    }

    private void handleSubscriptionUpdated(Event event) {
        com.stripe.model.Subscription stripeSubscription = 
            (com.stripe.model.Subscription) event.getDataObjectDeserializer().getObject().orElse(null);
        
        if (stripeSubscription == null) return;

        String customerId = stripeSubscription.getCustomer();
        User user = userRepository.findByStripeCustomerId(customerId);
        
        if (user == null) return;

        Subscription subscription = subscriptionRepository.findByUserId(user.getId())
                .orElse(new Subscription());

        subscription.setUserId(user.getId());
        subscription.setStripeSubscriptionId(stripeSubscription.getId());
        subscription.setStripePriceId(stripeSubscription.getItems().getData().get(0).getPrice().getId());
        subscription.setStatus(stripeSubscription.getStatus());
        subscription.setCancelAtPeriodEnd(stripeSubscription.getCancelAtPeriodEnd());
        subscription.setCurrentPeriodStart(
                LocalDateTime.ofInstant(Instant.ofEpochSecond(stripeSubscription.getCurrentPeriodStart()), ZoneId.systemDefault())
        );
        subscription.setCurrentPeriodEnd(
                LocalDateTime.ofInstant(Instant.ofEpochSecond(stripeSubscription.getCurrentPeriodEnd()), ZoneId.systemDefault())
        );

        // Determine plan name from price ID
        String priceId = stripeSubscription.getItems().getData().get(0).getPrice().getId();
        String planName = priceId.equals(proPriceId) ? "pro" : "enterprise";
        subscription.setPlanName(planName);

        subscriptionRepository.save(subscription);
        log.info("Subscription updated for user: {}", user.getId());
    }

    private void handleSubscriptionDeleted(Event event) {
        com.stripe.model.Subscription stripeSubscription = 
            (com.stripe.model.Subscription) event.getDataObjectDeserializer().getObject().orElse(null);
        
        if (stripeSubscription == null) return;

        subscriptionRepository.findByStripeSubscriptionId(stripeSubscription.getId())
                .ifPresent(subscription -> {
                    subscription.setStatus("cancelled");
                    subscription.setCancelledAt(LocalDateTime.now());
                    subscriptionRepository.save(subscription);
                    log.info("Subscription cancelled: {}", subscription.getId());
                });
    }

    private void handlePaymentSucceeded(Event event) {
        Invoice invoice = (Invoice) event.getDataObjectDeserializer().getObject().orElse(null);
        
        if (invoice == null) return;

        log.info("Payment succeeded for invoice: {}", invoice.getId());
        // Payment tracking can be implemented here if needed
    }
}
