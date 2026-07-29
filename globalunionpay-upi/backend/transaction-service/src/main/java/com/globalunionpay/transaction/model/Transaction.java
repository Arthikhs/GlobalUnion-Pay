package com.globalunionpay.transaction.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_user_id", columnList = "userId"),
        @Index(name = "idx_created_at", columnList = "createdAt"),
        @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String transactionId;

    @Column(nullable = false)
    private String userId;

    private String counterpartyUserId;
    private String counterpartyName;
    private String counterpartyUpiId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TransactionStatus status = TransactionStatus.PENDING;

    private String category;
    private String description;
    private String paymentId;
    private String upiTransactionId;
    private String bankReferenceNumber;

    // Balance snapshot
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime settledAt;

    public enum TransactionType {
        DEBIT, CREDIT, REFUND, CASHBACK, REWARD
    }

    public enum TransactionStatus {
        PENDING, SUCCESS, FAILED, REVERSED
    }
}
