package com.globalunionpay.user.service;

import com.globalunionpay.user.dto.UserDtos;
import com.globalunionpay.user.model.UserProfile;
import com.globalunionpay.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Cacheable(value = "userProfile", key = "#userId")
    public UserDtos.UserProfileResponse getProfile(String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found: " + userId));
        return mapToResponse(profile);
    }

    @CacheEvict(value = "userProfile", key = "#userId")
    public UserDtos.UserProfileResponse updateProfile(String userId, UserDtos.UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found: " + userId));

        if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
        if (request.getLastName() != null) profile.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getOccupation() != null) profile.setOccupation(request.getOccupation());
        if (request.getAddressLine1() != null) profile.setAddressLine1(request.getAddressLine1());
        if (request.getAddressLine2() != null) profile.setAddressLine2(request.getAddressLine2());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getState() != null) profile.setState(request.getState());
        if (request.getPincode() != null) profile.setPincode(request.getPincode());
        if (request.getCountry() != null) profile.setCountry(request.getCountry());

        UserProfile saved = userProfileRepository.save(profile);
        kafkaTemplate.send("user-profile-updated", userId, "Profile updated for user: " + userId);
        log.info("Profile updated for userId: {}", userId);
        return mapToResponse(saved);
    }

    public UserDtos.UserProfileResponse submitKyc(String userId, UserDtos.KycSubmitRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found: " + userId));

        profile.setPanNumber(maskPan(request.getPanNumber()));
        profile.setAadhaarNumber(maskAadhaar(request.getAadhaarNumber()));
        profile.setKycStatus(UserProfile.KycStatus.SUBMITTED);

        UserProfile saved = userProfileRepository.save(profile);
        kafkaTemplate.send("kyc-submitted", userId, "KYC submitted for user: " + userId);
        log.info("KYC submitted for userId: {}", userId);
        return mapToResponse(saved);
    }

    @Cacheable(value = "userByPhone", key = "#phoneNumber")
    public UserDtos.UserSearchResponse findByPhone(String phoneNumber) {
        UserProfile profile = userProfileRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + phoneNumber));
        return mapToSearchResponse(profile);
    }

    public List<UserDtos.UserSearchResponse> searchUsers(String query) {
        return userProfileRepository.searchUsers(query)
                .stream()
                .map(this::mapToSearchResponse)
                .collect(Collectors.toList());
    }

    public UserDtos.UserProfileResponse createProfile(String userId, String firstName, String lastName,
                                                       String email, String phoneNumber) {
        if (userProfileRepository.findByUserId(userId).isPresent()) {
            return getProfile(userId);
        }
        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phoneNumber(phoneNumber)
                .referralCode(generateReferralCode())
                .totalCashbackEarned(0.0)
                .totalReferrals(0)
                .build();
        UserProfile saved = userProfileRepository.save(profile);
        kafkaTemplate.send("user-created", userId, "New user profile created: " + userId);
        return mapToResponse(saved);
    }

    private String generateReferralCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder("GUP");
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }

    private String maskPan(String pan) {
        if (pan == null || pan.length() < 4) return pan;
        return "XXXXXX" + pan.substring(pan.length() - 4);
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.length() < 4) return aadhaar;
        return "XXXXXXXX" + aadhaar.substring(aadhaar.length() - 4);
    }

    private UserDtos.UserProfileResponse mapToResponse(UserProfile p) {
        return UserDtos.UserProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUserId())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .email(p.getEmail())
                .phoneNumber(p.getPhoneNumber())
                .profileImageUrl(p.getProfileImageUrl())
                .dateOfBirth(p.getDateOfBirth())
                .gender(p.getGender())
                .occupation(p.getOccupation())
                .addressLine1(p.getAddressLine1())
                .city(p.getCity())
                .state(p.getState())
                .pincode(p.getPincode())
                .country(p.getCountry())
                .kycStatus(p.getKycStatus())
                .panNumber(p.getPanNumber())
                .accountStatus(p.getAccountStatus())
                .referralCode(p.getReferralCode())
                .totalCashbackEarned(p.getTotalCashbackEarned())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private UserDtos.UserSearchResponse mapToSearchResponse(UserProfile p) {
        return UserDtos.UserSearchResponse.builder()
                .userId(p.getUserId())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .phoneNumber(p.getPhoneNumber())
                .profileImageUrl(p.getProfileImageUrl())
                .kycStatus(p.getKycStatus())
                .verified(p.getKycStatus() == UserProfile.KycStatus.VERIFIED)
                .build();
    }
}
