package com.globalunionpay.merchant.dto;

import com.globalunionpay.merchant.model.Merchant;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MerchantDtos {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RegisterMerchantRequest {
        @NotBlank private String userId;
        @NotBlank private String businessName;
        private String businessType;
        private String businessCategory;
        private String gstin;
        private String pan;
        private String supportEmail;
        private String supportPhone;
        private String bankAccountNumber;
        private String bankIfscCode;
        private String bankAccountName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MerchantResponse {
        private String merchantId;
        private String userId;
        private String businessName;
        private String businessType;
        private String businessCategory;
        private String merchantUpiId;
        private String logoUrl;
        private Merchant.MerchantStatus status;
        private BigDecimal totalRevenue;
        private BigDecimal pendingSettlement;
        private BigDecimal settledAmount;
        private LocalDateTime createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> success(String message, T data) {
            return ApiResponse.<T>builder().success(true).message(message).data(data).build();
        }
    }
}
