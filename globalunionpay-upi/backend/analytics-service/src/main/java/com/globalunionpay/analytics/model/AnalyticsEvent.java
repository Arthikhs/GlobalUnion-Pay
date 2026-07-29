package com.globalunionpay.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_events", indexes = {
        @Index(name = "idx_user_id", columnList = "userId"),
        @Index(name = "idx_event_type", columnList = "eventType"),
        @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String merchantId;

    @Enumerated(EnumType.STRING)
    private EventType eventType;

    private BigDecimal amount;
    private String category;
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    private String metadata;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum EventType {
        PAYMENT_INITIATED, PAYMENT_SUCCESS, PAYMENT_FAILED,
        USER_REGISTERED, USER_LOGIN, KYC_SUBMITTED, KYC_VERIFIED,
        MERCHANT_REGISTERED, WALLET_TOPUP, REFUND_INITIATED
    }

    public enum EventStatus {
        SUCCESS, FAILED, PENDING
    }
}
