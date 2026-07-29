package com.globalunionpay.merchant.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "merchants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String merchantId;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String businessName;

    private String businessType;
    private String businessCategory;
    private String gstin;
    private String pan;

    @Column(unique = true)
    private String merchantUpiId;

    private String logoUrl;
    private String websiteUrl;
    private String supportEmail;
    private String supportPhone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MerchantStatus status = MerchantStatus.PENDING;

    private BigDecimal totalRevenue;
    private BigDecimal pendingSettlement;
    private BigDecimal settledAmount;

    private String bankAccountNumber;
    private String bankIfscCode;
    private String bankAccountName;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum MerchantStatus {
        PENDING, ACTIVE, SUSPENDED, REJECTED
    }
}
