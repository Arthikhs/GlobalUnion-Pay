package com.globalunionpay.wallet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    @Column(name = "balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal balance;

    @Column(name = "locked_balance", precision = 12, scale = 2)
    private BigDecimal lockedBalance;

    @Enumerated(EnumType.STRING)
    private WalletStatus status;

    @Version  // Optimistic locking — prevents double spend
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum WalletStatus { ACTIVE, FROZEN, CLOSED }
}
