package com.globalunionpay.wallet.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WalletDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WalletResponse {
        private String userId;
        private BigDecimal balance;
        private BigDecimal totalAdded;
        private BigDecimal totalSpent;
        private String currency;
        private LocalDateTime lastUpdated;
    }
}
