package com.globalunionpay.payment.dto;

import com.globalunionpay.payment.model.Payment;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InitiatePaymentRequest {
        @NotBlank
        private String senderUserId;
        @NotBlank
        private String receiverUpiId;
        @NotNull
        @DecimalMin("1.00")
        @DecimalMax("100000.00")
        private BigDecimal amount;
        private String description;
        private String category;
        private Payment.PaymentType paymentType;
        private String deviceId;
        private String ipAddress;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConfirmPaymentRequest {
        @NotBlank
        private String paymentId;
        @NotBlank
        private String upiPin;
        private String deviceId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SchedulePaymentRequest {
        @NotBlank
        private String senderUserId;
        @NotBlank
        private String receiverUpiId;
        @NotNull
        private BigDecimal amount;
        private String description;
        @NotNull
        private LocalDateTime scheduledAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentResponse {
        private String paymentId;
        private String senderUserId;
        private String receiverUserId;
        private String senderUpiId;
        private String receiverUpiId;
        private BigDecimal amount;
        private String currency;
        private Payment.PaymentStatus status;
        private Payment.PaymentType paymentType;
        private String description;
        private String category;
        private String upiTransactionId;
        private String bankReferenceNumber;
        private String failureReason;
        private LocalDateTime createdAt;
        private LocalDateTime completedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> success(String message, T data) {
            return ApiResponse.<T>builder().success(true).message(message).data(data).build();
        }

        public static <T> ApiResponse<T> error(String message) {
            return ApiResponse.<T>builder().success(false).message(message).build();
        }
    }
}
