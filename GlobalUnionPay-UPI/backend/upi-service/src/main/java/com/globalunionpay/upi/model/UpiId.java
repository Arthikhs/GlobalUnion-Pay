package com.globalunionpay.upi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "upi_ids")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpiId {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "upi_id", unique = true, nullable = false)
    private String upiId;  // e.g. john@globalunionpay

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "bank_account_id")
    private Long bankAccountId;

    @Column(name = "is_primary")
    private boolean primary;

    @Enumerated(EnumType.STRING)
    private UpiStatus status;

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum UpiStatus { ACTIVE, INACTIVE, BLOCKED }
}
