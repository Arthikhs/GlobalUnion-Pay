package com.globalunionpay.upi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "upi_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpiTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_ref", unique = true, nullable = false)
    private String transactionRef;  // UPI transaction reference

    @Column(name = "sender_upi_id", nullable = false)
    private String senderUpiId;

    @Column(name = "receiver_upi_id", nullable = false)
    private String receiverUpiId;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "note")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TransactionType type;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "rrn")  // RRN - Retrieval Reference Number (like real UPI)
    private String rrn;

    @CreationTimestamp
    @Column(name = "initiated_at")
    private LocalDateTime initiatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum TransactionStatus { INITIATED, PROCESSING, SUCCESS, FAILED, REVERSED }
    public enum TransactionType { PAY, COLLECT, REFUND, SPLIT }
}
