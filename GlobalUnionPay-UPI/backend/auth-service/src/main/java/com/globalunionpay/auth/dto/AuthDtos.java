package com.globalunionpay.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class AuthDtos {

    @Getter @Setter
    public static class RegisterRequest {
        @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian phone number")
        private String phone;
        @NotBlank @Size(min = 8)
        private String password;
        @NotBlank
        private String fullName;
        @Email
        private String email;
    }

    @Getter @Setter
    public static class LoginRequest {
        @NotBlank
        private String phone;
        @NotBlank
        private String password;
        private String deviceId;
    }

    @Getter @Setter
    public static class OtpRequest {
        @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$")
        private String phone;
    }

    @Getter @Setter
    public static class OtpVerifyRequest {
        @NotBlank
        private String phone;
        @NotBlank @Size(min = 6, max = 6)
        private String otp;
    }

    @Getter @Setter
    public static class SetUpiPinRequest {
        @NotBlank @Size(min = 6, max = 6)
        private String upiPin;
        @NotBlank @Size(min = 6, max = 6)
        private String otp;
    }

    @Getter @Setter @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private Long expiresIn;
        private UserInfo user;
    }

    @Getter @Setter @Builder
    public static class UserInfo {
        private Long id;
        private String phone;
        private String fullName;
        private String email;
        private String profileImageUrl;
        private String kycStatus;
        private boolean phoneVerified;
    }

    @Getter @Setter
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }
}
