package com.globalunionpay.upi.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

public class UpiDtos {

    @Getter @Setter
    public static class CreateUpiRequest {
        @NotBlank
        private String username;  // becomes username@globalunionpay
        @NotNull
        private Long bankAccountId;
    }

    @Getter @Setter
    public static class ValidateUpiRequest {
        @NotBlank
        private String upiId;
    }

    @Getter @Setter @Builder
    public static class UpiValidationResponse {
        private String upiId;
        private String fullName;
        private String profileImageUrl;
        private boolean verified;
        private String bankName;
        private String upiStatus;
    }

    @Getter @Setter
    public static class InitiatePaymentRequest {
        @NotBlank
        private String senderUpiId;
        @NotBlank
        private String receiverUpiId;
        @NotNull @DecimalMin("1.00") @DecimalMax("100000.00")
        private BigDecimal amount;
        private String note;
        @NotBlank @Size(min = 6, max = 6)
        private String upiPin;
    }

    @Getter @Setter @Builder
    public static class PaymentResponse {
        private String transactionRef;
        private String rrn;
        private String status;
        private BigDecimal amount;
        private String senderUpiId;
        private String receiverUpiId;
        private String message;
        private String completedAt;
    }

    @Getter @Setter
    public static class CollectRequest {
        @NotBlank
        private String fromUpiId;
        @NotBlank
        private String toUpiId;
        @NotNull @DecimalMin("1.00")
        private BigDecimal amount;
        private String note;
    }

    @Getter @Setter @Builder
    public static class UpiIdResponse {
        private Long id;
        private String upiId;
        private boolean primary;
        private String status;
        private String qrCodeUrl;
    }
}
