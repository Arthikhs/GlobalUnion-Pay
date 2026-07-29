package com.globalunionpay.payment.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String paymentId;

    @Column(nullable = false)
    private String senderUserId;

    @Column(nullable = false)
    private String receiverUserId;

    private String senderUpiId;
    private String receiverUpiId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    private String currency;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.INITIATED;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    private String description;
    private String category;

    // Razorpay
    private String razorpayOrderId;
    private String razorpayPaymentId;

    // UPI Reference
    private String upiTransactionId;
    private String bankReferenceNumber;

    // Metadata
    private String deviceId;
    private String ipAddress;
    private String location;

    // Failure
    private String failureReason;
    private Integer retryCount;

    // Scheduled
    private LocalDateTime scheduledAt;
    private boolean isScheduled;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;

    public enum PaymentStatus {
        INITIATED, PENDING, PROCESSING, SUCCESS, FAILED, REFUNDED, CANCELLED, SCHEDULED
    }

    public enum PaymentType {
        UPI, WALLET, BANK_TRANSFER, QR_CODE, MERCHANT, SPLIT, INTERNATIONAL, SCHEDULED
    }
}
