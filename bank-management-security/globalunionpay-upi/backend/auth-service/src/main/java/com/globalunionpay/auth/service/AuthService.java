package com.globalunionpay.auth.service;

import com.globalunionpay.auth.dto.AuthDtos.*;
import com.globalunionpay.auth.model.User;
import com.globalunionpay.auth.repository.UserRepository;
import com.globalunionpay.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final RedisTemplate<String, String> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String OTP_PREFIX = "OTP:";
    private static final int OTP_EXPIRY_MINUTES = 5;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = User.builder()
                .phone(request.getPhone())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .status(User.UserStatus.PENDING)
                .kycStatus(User.KycStatus.PENDING)
                .roles(Set.of(User.Role.ROLE_USER))
                .phoneVerified(false)
                .emailVerified(false)
                .build();

        userRepository.save(user);

        // Publish user registered event to Kafka
        kafkaTemplate.send("user-registered", Map.of(
                "userId", user.getId(),
                "phone", user.getPhone(),
                "fullName", user.getFullName()
        ));

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhone(), request.getPassword())
        );

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == User.UserStatus.BLOCKED) {
            throw new RuntimeException("Account is blocked. Contact support.");
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public String sendOtp(String phone) {
        // Auto-create user if not exists
        if (!userRepository.existsByPhone(phone)) {
            User user = User.builder()
                    .phone(phone)
                    .fullName("User" + phone.substring(phone.length() - 4))
                    .password(passwordEncoder.encode(phone))
                    .status(User.UserStatus.PENDING)
                    .kycStatus(User.KycStatus.PENDING)
                    .roles(Set.of(User.Role.ROLE_USER))
                    .phoneVerified(false)
                    .emailVerified(false)
                    .build();
            userRepository.save(user);
        }

        String otp = generateOtp();
        String key = OTP_PREFIX + phone;
        redisTemplate.opsForValue().set(key, otp, Duration.ofMinutes(OTP_EXPIRY_MINUTES));
        kafkaTemplate.send("otp-requested", Map.of("phone", phone, "otp", otp));
        log.info("OTP for phone: {} → {}", phone, otp);
        return otp;
    }

    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String key = OTP_PREFIX + request.getPhone();
        String storedOtp = redisTemplate.opsForValue().get(key);

        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        redisTemplate.delete(key);

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPhoneVerified(true);
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        String phone = jwtTokenProvider.extractPhone(refreshToken);
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        Map<String, Object> claims = Map.of(
                "userId", user.getId(),
                "roles", user.getRoles(),
                "fullName", user.getFullName()
        );
        String accessToken = jwtTokenProvider.generateAccessToken(user.getPhone(), claims);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getPhone());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(UserInfo.builder()
                        .id(user.getId())
                        .phone(user.getPhone())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .profileImageUrl(user.getProfileImageUrl())
                        .kycStatus(user.getKycStatus() != null ? user.getKycStatus().name() : null)
                        .phoneVerified(user.isPhoneVerified())
                        .build())
                .build();
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
