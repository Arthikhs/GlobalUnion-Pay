package com.globalunionpay.user.dto;

import com.globalunionpay.user.model.UserProfile;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private LocalDate dateOfBirth;
        private String gender;
        private String occupation;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
        private String country;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KycSubmitRequest {
        @NotBlank
        private String panNumber;
        @NotBlank
        private String aadhaarNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileResponse {
        private Long id;
        private String userId;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String profileImageUrl;
        private LocalDate dateOfBirth;
        private String gender;
        private String occupation;
        private String addressLine1;
        private String city;
        private String state;
        private String pincode;
        private String country;
        private UserProfile.KycStatus kycStatus;
        private String panNumber;
        private UserProfile.AccountStatus accountStatus;
        private String referralCode;
        private Double totalCashbackEarned;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSearchResponse {
        private String userId;
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private String profileImageUrl;
        private UserProfile.KycStatus kycStatus;
        private boolean verified;
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
